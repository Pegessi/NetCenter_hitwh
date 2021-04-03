# coding:utf-8
from flask import Flask,request,json, jsonify
from flask_sqlalchemy import SQLAlchemy

from params import appConfig
from api.user import blueprintUser
from api.repairsheet import blueprintRepair
from api.file import blueprintFile
from api.question import blueprintQuestion
from api.lostcard import blueprintLostcard

app = Flask(__name__)
app.config.from_mapping(appConfig)
# 动态追踪数据库的修�? 性能不好. 且未来版本中会移�? 目前只是为了解决控制台的提示才写�?
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# 创建数据库的操作对象
db = SQLAlchemy(app)

app.register_blueprint(blueprintUser)
app.register_blueprint(blueprintRepair)
app.register_blueprint(blueprintFile)
app.register_blueprint(blueprintQuestion)
app.register_blueprint(blueprintLostcard)

@app.teardown_request
def checkin_db(exc):
    try:
        app.db.session.remove()
        # PyMongo maintains a built-in connection pool
        # http://api.mongodb.com/python/current/faq.html#how-does-connection-pooling-work-in-pymongo
    except AttributeError:
        pass

if __name__ == '__main__':
    app.config['JSON_AS_ASCII'] = False
    app.run(host = "0.0.0.0", port = 34427, debug = False)