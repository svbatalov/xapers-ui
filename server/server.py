#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, \
     request, send_from_directory, abort, \
     jsonify
from flask_cors import CORS

import xapers as X
import argparse, os, re
import itertools
import operator

parser = argparse.ArgumentParser()
parser.add_argument('-r', '--xapers-root',
                    help="Xapers root directory", default="~/.xapers/docs")
parser.add_argument('--host', help="Host", default="0.0.0.0")
parser.add_argument('-p', '--port', help="Port", default=5000, type=int)

args = parser.parse_args()
args.xapers_root = os.path.join(os.path.expanduser(args.xapers_root), '')
print "Args:", args
app = Flask(__name__)
CORS(app)

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

@app.route("/term/<string:prefix>")
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

@app.route("/tags/")
@app.route("/tags/<string:prefix>")
def tags(prefix = ''):
    prefix = prefix.encode('utf-8')
    db = DB()
    res = [ t for t in db.tag_iter() if t.startswith(prefix) ]
    return jsonify(items=res)

@app.route("/id/<int:id>")
def file_by_id(id):
    res = queryDB('id:'+str(id), 1)
    if len(res) == 0: return abort(404)
    file = res[0].get_files()[0]
    id = '{0:0>10}'.format(id)
    path = os.path.join(id, file)
    print "SERVING PATH", args.xapers_root + path
    return send_from_directory(args.xapers_root, path, as_attachment=True)

@app.route("/id/<int:id>", methods=['POST'])
def set_by_id(id):
    data = request.get_json()
    print data
    res = queryDB('id:'+str(id), 1, writable=True)
    if len(res) == 0:
        return 'Error: document not found', 404

    doc = res[0]

    if 'bibtex' in data:
        bibtex = data['bibtex']
        print 'Setting bibtex', bibtex
        doc.add_bibtex(bibtex)

    if 'tags' in data:
        tags = data['tags']
        print 'Setting tags', tags
        old_tags = doc.get_tags()
        doc.remove_tags(old_tags)
        doc.add_tags(tags)
    
    doc.sync()
    return 'OK'

@app.route("/")
@app.route("/search")
def search():
    keywords = request.args.get('q', '')
    limit = int(request.args.get('l', 0))
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

if __name__ == "__main__":
    from eventlet import wsgi
    import eventlet
    wsgi.server(eventlet.listen((args.host, args.port)), app)
    #app.run()
