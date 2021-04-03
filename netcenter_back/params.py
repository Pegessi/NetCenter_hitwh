TECENT_TIMEOUT_INTERVAL = 5
# Flask app parameters
# secretKey = b"/[\xec\nz8Q4F'L2y#5_"
appConfig = {
                'DEBUG': True,
                'SQLALCHEMY_DATABASE_URI': 'mysql+pymysql://root:#A4708D26F8498F6D42BF983525D14C9A@cdb-mby7qnqd.gz.tencentcdb.com:10047/netcenter?autocommit=true',
                'pool_size':100, 
                'max_overflow':20,
                'SQLALCHEMY_POOL_RECYCLE':360
}
# mailConfig
mailConfig={
                'user': 'hitwhnetcenter@126.com',
                'password': 'hitwhshouquan9',
                'manager':['41222170@qq.com','792996056@qq.com'],
}
wxConfig = {
               'appid': 'wx3f8c6af392a76209',
               'secret': '0fe5d68bef929711ee76948335af89e0',
               'url': 'https://api.weixin.qq.com/sns/jscode2session'
           }