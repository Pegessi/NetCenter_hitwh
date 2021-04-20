# -*- coding: UTF-8 -*-
from flask import Flask,request,json, jsonify,Blueprint,current_app
from flask_sqlalchemy import SQLAlchemy
from models import *
from params import appConfig
#导入beautifulsoup库
from bs4 import BeautifulSoup
#导入request库 
import requests
import time
from datetime import date
from datetime import datetime
app = Flask(__name__)
app.config.from_mapping(appConfig)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
blueprintNotice = Blueprint('notice', __name__)
db.app = app
db.init_app(app)
db.create_all()
          
#爬取网页通知
@blueprintNotice.route('/noticecrawler')
def noticecrawler():
     # while Notice.query.count() != 0:
     #      try:
     #           notice = Notice.query.first()
     #           db.session.delete(notice)
     #           db.session.commit()
               
     #           print('---删除成功---')
     #      except:
     #           app.logger.error("Error in delete data", exc_info=True)
     #           db.session.rollback()    
     #      finally:
     #           db.session.close()

     #url头
     server = 'https://www.hitwh.edu.cn'
     #爬取网页链接
     target = 'https://www.hitwh.edu.cn'
     #构造请求头的参数,破解初级网站反爬机制
     headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'}
     #Get方式获取网页数据 req为URL对象    
     req = requests.get(url = target,headers=headers)
     #修改网页编码
     req.encoding = 'UTF-8'
     #Response.text 把数据转为字符串 用于获取文本、网页原代码类的数据。
     html = req.text
     #创建beautifulsoup对象,指定lxml解析器解析HTML文档
     html_bf = BeautifulSoup(html,'lxml')
     #搜索文档树 返回一个list find_all（name，attrs，recursive，string，limit，** kwargs）name:标签名 attr 标签属性
     div = html_bf.find_all('div',frag = '窗口30')
     #实例化搜索结果
     div_bf= BeautifulSoup(str(div[0]),'lxml') 
     #搜索文档树 返回list
     li = div_bf.find_all('li')
     #遍历文档逐个输出
     i =1
     while Notice.query.count() != 0:
          try:
               notice = Notice.query.first()
               db.session.delete(notice)
               db.session.commit()
               
               print('---删除成功---')
          except:
               app.logger.error("Error in delete data", exc_info=True)
               db.session.rollback()    
          finally:
               db.session.close()
     else:
          for each in li:
               try:
                    notice = Notice(id =i,title = each.find('a').get_text(),link = server+each.find('a').get('href'),date = each.find('span',class_='news-time').get_text())
                    db.session.add(notice)
                    db.session.commit()
                    i=i+1
               except:
                    app.logger.error("Error in  add", exc_info=True)
                    db.session.rollback()
               finally:
                    db.session.close()
          print('---爬取成功---')
     return 'noticecrawler'   

#获取数据库爬取的数据
@blueprintNotice.route('/getNotice')
def getNotice():
     t =[]
     notice = Notice.query.all()
     length = Notice.query.count()
     db.session.close()
     if length != 0:
          for i in range(length):
               tt = {}
               tt['title'] = notice[i].title
               tt['link'] = notice[i].link
               tt['date'] = notice[i].date
               t.append(tt)
               
     else:
          tt={}
          tt['status'] = 'false'
          t.append(tt)
     # print(t)
     return json.dumps(t,ensure_ascii=False)

#返回数据库中表push的数据
@blueprintNotice.route('/getPush')
def getPush():
     t = []
     push = Push.query.all()
     length = Push.query.count()
     db.session.close()
     if length != 0:
          for i in range(length):
               tt = {}
               tt['name'] = push[i].name
               tt['imgurl'] = push[i].imgurl
               tt['link'] = push[i].link
               t.append(tt)
     else:
          tt={}
          tt['status']='false'
          t.append(tt)
     return json.dumps(t,ensure_ascii=False)


@blueprintNotice.route('/test2')
def test():
    test = Test.query.all()
    length = Test.query.count()
    db.session.close()
    if length != 0:
         for i in range(length):
              print(str(test[i].id)+':'+test[i].name)
    return 'noticetest'
    
     

    
