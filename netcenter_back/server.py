# coding:utf-8
from os import set_inheritable, truncate
from flask import Flask,request,json, jsonify
from flask.helpers import total_seconds
from flask_sqlalchemy import SQLAlchemy
from pytz import HOUR
from params import appConfig
from api.user import blueprintUser
from api.repairsheet import blueprintRepair
from api.file import blueprintFile
from api.question import blueprintQuestion
from api.lostcard import blueprintLostcard
from api.notice import blueprintNotice,noticecrawler,test
from api.vsinfo import blueprintVsInfo,VsInfoCrawler
from api.wxinfo import blueprintWxInfo
import time
from datetime import date
from datetime import datetime
from functools import wraps
from models import *

#导入APScheduler�?
from apscheduler.schedulers.background import BackgroundScheduler


app = Flask(__name__)


app.config.from_mapping(appConfig)
# 动态追踪数据库的修�? 性能不好. 且未来版本中会移�? 目前只是为了解决控制台的提示才写�?
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# 创建数据库的操作对象
db = SQLAlchemy(app)
db.create_all()


app.register_blueprint(blueprintUser)
app.register_blueprint(blueprintRepair)
app.register_blueprint(blueprintFile)
app.register_blueprint(blueprintQuestion)
app.register_blueprint(blueprintLostcard)
app.register_blueprint(blueprintNotice)
app.register_blueprint(blueprintVsInfo)
app.register_blueprint(blueprintWxInfo)

@app.teardown_request
def checkin_db(exc):
    try:
        app.db.session.remove()
        # PyMongo maintains a built-in connection pool
        # http://api.mongodb.com/python/current/faq.html#how-does-connection-pooling-work-in-pymongo
    except AttributeError:
        pass

# def test1():
#     print("1")

# def test2():
#     print("2")
def myScheduler():
        #实例化scheduler 使用默认�?job store 以及默认�?executor
        #BlockingScheduler: 如果调度器是你程序中唯一要运行的东西，请选择�?
        sched = BackgroundScheduler()
        
        
        '''
        interval 表示周期性触发触�?
        days(int) ：间隔天�?hours(int) ：间隔小时数 minutes(int) ：间隔分钟数 seconds(int) ：间隔秒�?
        cron 定时调度
        (int|str) 表示参数既可以是int类型，也可以是str类型
        (datetime | str) 表示参数既可以是datetime类型，也可以是str类型
        year (int|str) – 4-digit year -（表示四位数的年份，如2008年）
        month (int|str) – month (1-12) -（表示取值范围为1-12月）
        day (int|str) – day of the (1-31) -（表示取值范围为1-31日）
        week (int|str) – ISO week (1-53) -（格里历2006年12月31日可以写成2006年-W52-7（扩展形式）或2006W527（紧凑形式））
        day_of_week (int|str) – number or name of weekday (0-6 or mon,tue,wed,thu,fri,sat,sun) - （表示一周中的第几天，既可以用0-6表示也可以用其英语缩写表示）
        hour (int|str) – hour (0-23) - （表示取值范围为0-23时）
        minute (int|str) – minute (0-59) - （表示取值范围为0-59分）
        second (int|str) – second (0-59) - （表示取值范围为0-59秒）
        start_date (datetime|str) – earliest possible date/time to trigger on (inclusive) - （表示开始时间）
        end_date (datetime|str) – latest possible date/time to trigger on (inclusive) - （表示结束时间）
        timezone (datetime.tzinfo|str) – time zone to use for the date/time calculations (defaults to scheduler timezone) -（表示时区取值）
        '''

        sched.add_job(noticecrawler, 'cron',hour='12,18' ,id ='noticecrawler')
        sched.add_job(VsInfoCrawler,'cron',hour ='12,18',id = 'VsInfoCrawler')
        
        #启动scheduler
        sched.start()        

if __name__ == '__main__':
    myScheduler()
    app.config['JSON_AS_ASCII'] = False
    app.run(host = "0.0.0.0", port = 34427, debug =True )
    
    