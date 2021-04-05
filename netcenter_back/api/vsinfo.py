
from flask import Flask,request,json, jsonify,Blueprint,current_app
from flask_sqlalchemy import SQLAlchemy
from models import *
from params import appConfig
#导入beautifulsoup库
from bs4 import BeautifulSoup
#导入request库 
import requests

app = Flask(__name__)
app.config.from_mapping(appConfig)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
blueprintVsInfo = Blueprint('vsinfo', __name__)
# db.app = app
# db.init_app(app)
# db.create_all()

@blueprintVsInfo.route('/VsInfoCrawler')
def VsInfoCrawler():
     target = 'https://www.saikr.com/vs'
     # target = 'https://www.saikr.com/vs/engineering/0/0'
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
     li = html_bf.find_all('li',class_ = "item clearfix")
     count=1
     #遍历文档逐个输出
     for i in li:
          name = i.find('a',class_="link").get('title')
          link = i.find("a",class_="link").get('href')
          list = i.find_all('p')
          length = len(list)
          list2 =[]
          for j in range(length):
               a = list[j].find('span').get_text()
               b = list[j].get_text(strip = True)
               list2.append(b[len(a):])
          # print(list2)
          sponsor=list2[0]
          level=list2[1]
          register_time=list2[2]
          play_time=list2[3]
          if VsInfo.query.count()==10:
               try:
                    vsinfo=VsInfo.query.filter_by(id = count).update({'name':name,'link':link,'sponsor':sponsor,'level':level,'register_time':register_time,'play_time':play_time})
                    db.session.commit()
                    count=count+1
               except:
                    app.logger.error("Error in  add", exc_info=True)
                    db.session.rollback()
               finally:
                    db.session.close()
          else:
               try:
                    vsinfo=VsInfo(id=count,name = name,link=link,sponsor=sponsor,level=level,register_time=register_time,play_time=play_time)
                    db.session.add(vsinfo)
                    db.session.commit()
                    count=count+1     
               except:
                    app.logger.error("Error in  add", exc_info=True)
                    db.session.rollback()
               finally:
                    db.session.close()
     
     return "getVsInfo"

@blueprintVsInfo.route('/getVsInfo')
def getVsInfo():
     t=[]
     vsinfo=VsInfo.query.all()
     length = VsInfo.query.count()
     db.session.close()
     if length !=0:
          for i in range(length):
               tt={}
               tt['id']=vsinfo[i].id
               tt['name']=vsinfo[i].name
               tt['link']=vsinfo[i].link
               tt['sposor']=vsinfo[i].sponsor
               tt['level']=vsinfo[i].level
               tt['register_time']=vsinfo[i].register_time
               tt['play_time']=vsinfo[i].play_time
               t.append(tt)
     else:
          tt={}
          tt['status'] = 'false'
          t.append(tt)
     return json.dumps(t,ensure_ascii=False)
