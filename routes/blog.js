//importing express
const express = require('express')
 //importing the controller
const blogController = require('./../controllers/blogController')
//importing app configrations
const appConfig = require('./../config/appConfig')
//importing the custom middleware
const example = require('./../middlewares/example')
const auth = require('./../middlewares/auth')

let setRouter = (app) => {
    let baseUrl = appConfig.apiVersion+'/blogs';
  //  app.get('/test/route/:param1/:param2',blogController.testRoute) //
    app.get(baseUrl+'/all',auth.isAuthenticated,blogController.getAllBlog);
    /**
     * @api {get}  /api/v1/blogs/all Get all blogs
     * @apiVersion 0.0.1
     * @apiGroup read
     * 
     * @apiParam {String} authToken The token of authentication.( passed as a query parameter)
     * 
     * @apiSuccessExample {json} Success-Response:
     * {
       "error": false,
        "message": "All Blog Details Found",
        "status": 200,
        "data": [
         {
            title: "string",
            description: "string",
            bodyHtml: "string",
            views: number,
            isPublished: boolean,
            category: "string",
            author: "string",
            tags: object(type = array),
            blogId: "string",
            created: "date",
            lastModified: "date"
          }

        }
        @apiErrorExample {json} Error-Response:
        *
        * {
        *   "error":true,
        *   "message": "Error Occured",
        *    "status": 500,
        *    "data": null   
        * }
     */
    app.get(baseUrl+'/view/:blogId',example.exampleMiddleware,blogController.viewBlogById); 
    app.get(baseUrl+'/view/by/author/:author',blogController.viewByAuthor);
    app.get(baseUrl+'/view/by/category/:category',blogController.viewByCategory); 
    app.post(baseUrl+'/:blogId/delete',blogController.deleteBlog); 
    app.put(baseUrl+'/:blogId/edit',blogController.editBlog);
    app.post(baseUrl+'/create',auth.isAuthenticated,blogController.createBlog); 
    app.get(baseUrl+'/:blogId/count/view',blogController.increaseBlogView); 

} // end setRouter function

module.exports = {
    setRouter: setRouter
}