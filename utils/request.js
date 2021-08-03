import config from './config'
export default(url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.host + url, 
      data,
      method,
      header: {
				cookie: wx.getStorageSync('cookie').toString(),
			},
      success :(res) => {
        if (data.isLogin) {
					// 将cookies保存至本地
					wx.setStorageSync('cookie', res.cookies);
				}
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}