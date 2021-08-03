// pages/recommend/recommend.js
import request from '../../utils/request'
import PubSub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList:[],
    index:0,//标识跳转至toSongDetail的下标
  },
  toSongDetail(event){
    //let song =event.currentTarget.dataset.song;
    //let musicId = event.currentTarget.dataset.id;
    let{musicid,index}=event.currentTarget.dataset;
    this.setData({index})
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + musicid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let recommendListData=await request('/recommend/songs')
    this.setData({
      recommendList:recommendListData.recommend,
    })
    //推荐列表是订阅方
    PubSub.subscribe('switchType',(msg,type)=>{
      let {recommendList,index}=this.data;
      if(type==='pre'){
        index === 0 && (index=recommendList.length)
        index -= 1;
      }else{
        index===recommendList.length-1 &&(index=-1)
        index += 1;
      }
      //从pubsub拿到音乐的id
      let musicId = recommendList[index].id
      this.setData({index});
      PubSub.publish('musicId',musicId);
    })
    //日推首页的日期
    this.setData({
    	day: new Date().getDate(),
    	month: new Date().getMonth() + 1,
        /* 月份是从1月开始，需要+1 */
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})