from flask import Blueprint, \
     request, send_from_directory, abort, \
     jsonify, current_app

import os, re
import xapers as X
import itertools
import operator

def create_api(args):
    api = Blueprint('api', __name__)

    def DB(writable=False):
        return X.Database(args.xapers_root, writable=writable)

    def queryDB(q, limit=0, writable=False):
        return DB(writable).search(q, limit=limit)

    def term_iter(prefix):
        print 'PREFIX', prefix, type(prefix)
        return DB().term_iter(prefix)

    def request_wants_json():
        best = request.accept_mimetypes \
                .best_match(['application/json', 'text/html'])
        return best == 'application/json' and \
                request.accept_mimetypes[best] > \
                request.accept_mimetypes['text/html']

    @api.route("/term/<string:prefix>")
    def term(prefix):
        prefix = prefix.encode('utf-8')
        words = [ prefix + term for term in term_iter(prefix) ]
        #  res = [ term for term in term_iter(prefix.encode('utf-8')) ]
        db = DB()
        stat = [ [w, db.count(w)] for w in words]
        res = sorted(stat, key=operator.itemgetter(1))
        res = list( itertools.islice(reversed(res), 10) )
        print res
        res = [w for w,n in res]
        return jsonify(items=res)

    @api.route("/tags/")
    @api.route("/tags/<string:prefix>")
    def tags(prefix = ''):
        prefix = prefix.encode('utf-8')
        db = DB()
        res = [ t for t in db.tag_iter() if t.startswith(prefix) ]
        return jsonify(items=res)

    @api.route("/id/<int:id>")
    def file_by_id(id):
        res = queryDB('id:'+str(id), 1)
        if len(res) == 0: return abort(404)
        file = res[0].get_files()[0]
        id = '{0:0>10}'.format(id)
        path = os.path.join(id, file)
        print "SERVING PATH", args.xapers_root + path
        return send_from_directory(args.xapers_root, path, as_attachment=True)

    @api.route("/id/<int:id>", methods=['POST'])
    def set_by_id(id):
        data = request.get_json()
        print data
        res = queryDB('id:'+str(id), 1, writable=True)
        if len(res) == 0:
            return 'Error: document not found', 404

        doc = res[0]

        if 'bibtex' in data:
            bibtex = data['bibtex']
            doc.add_bibtex(bibtex)

        if 'tags' in data:
            tags = data['tags']
            print 'Setting tags', tags
            old_tags = doc.get_tags()
            doc.remove_tags(old_tags)
            doc.add_tags(tags)
        
        doc.sync()
        return 'OK'

    @api.route("/search")
    @api.route("/")
    def search():
        keywords = request.args.get('q', '')
        limit = int(request.args.get('l', 0))

        r = re.compile(r"(l|limit):\s*([0-9]+)\s*")
        matches = r.findall(keywords)
        if matches:
            limit = int(matches[-1][1])

        keywords = r.sub("", keywords).strip()

        res = queryDB(keywords, limit)
        res = [ {'id': item.get_docid(),
                 'key': item.get_key(),
                 'matchp': item.matchp,
                 'bib': item.get_bibdata() or {},
                 'bibtex': item.get_bibtex(),
                 'tags': item.get_tags(),
                 'path': item.get_fullpaths()[0].decode('utf-8')}
               for item in res]
        
        return jsonify(items=res)

    return api
