const express = require('express')

const mongoose = require('mongoose')

const BlogModel = mongoose.model('Blog');

const shortid = require('shortid')

const response = require('./../libs/responseLib')

const check = require('./../libs/checkLib')

const logger = require('./../libs/loggerLib')

let testRoute = (req,res) => {
    console.log(req.params)
    res.send(req.params)
} // end test

let testQuery = (req,res) => {
    console.log(req.query)
    res.send(req.query)
} //end test

let testBody = (req,res) => {
    console.log(req.body)
    res.send(req.body)
} // end test

let getAllBlog = (req,res) => {
    BlogModel.find()
        .lean()
        .exec((err, result) => {
            if(err){
                console.log(err)
                logger.error(err.message,'Blog Controller: getAllBlog',10)
                let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)){
                let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
            } else {
                logger.info('All Blog Details Found','Blog Controller: getAllBlog',5)
                let apiResponse = response.generate(false,'All Blog Details Found',200,result)
                res.send(apiResponse)
            }
        })
} // end get all blogs

//function to read a single blog
let viewBlogById = (req, res) => {
    console.log(req.user)
    BlogModel.findOne({'blogId':req.params.blogId},(err, result) => {

        if(err){
            let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'All Blog Details Found',200,result)
                res.send(apiResponse)
        }
    })
}

//function to read blogs by category
let viewByCategory = (req, res) => {
    BlogModel.find({'category':req.params.category},(err, result) => {

        if(err){
            let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'All Blog Details Found',200,result)
                res.send(apiResponse)
        }
    })
}

//function to read blogs by author
let viewByAuthor = (req, res) => {
    BlogModel.find({'author':req.params.author},(err, result) => {

        if(err){
            let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'All Blog Details Found',200,result)
                res.send(apiResponse)
        }
    })
}

//method to create a blog
let createBlog = (req, res) => {
    var today = Date.now();
    let blogId = shortid.generate()

    let newBlog = new BlogModel({
        blogId: blogId,
        title: req.body.title,
        description: req.body.description,
        bodyHtml: req.body.bodyHtml,
        isPublished: true,
        category: req.body.category,
        author: req.body.author,
        created: today,
        lastModified: today
    }) // end new blog model

    //let tags = (req.body.tags != undefined || req.body.tags != null || req.body.tags.length != 0)?req.body.tags.split(','):[]
    //newBlog.tags = tags

    newBlog.save((err, result) => {
        if(err){
            let apiResponse = response.generate(true,'Failed To Create Blog',500,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'Blog Created Successfully',200,result)
                res.send(apiResponse)
        }
    }) // end new blog save
}

//method to edit the blog
let editBlog = (req,res) => {
    let options = req.body;
    console.log(options)
    BlogModel.updateMany({'blogId': req.params.blogId},options). exec((err, result) => {
        if(err){
            let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'Blog Updated Successfully',200,result)
                res.send(apiResponse)
            }
       }
    )
}

//method to increase the count of view
let increaseBlogView = (req,res) => {
    BlogModel.findOne({'blogId':req.params.blogId},(err, result) => {
        if(err) {
            let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
        } else if (result == undefined || result == '' || result == null){
            let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
        } else {
            result.views += 1
            result.save((err,result) => {
                if (err){
                    let apiResponse = response.generate(true,'Failed To Update Blog View Count',500,null)
                res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false,'Blog Updated Successfully',200,result)
                    res.send(apiResponse)
                }
            })// end result
        }
    })
}

//function to delete a single blog
let deleteBlog = (req, res) => {
    BlogModel.remove({'blogId':req.params.blogId},(err, result) => {

        if(err){
            let apiResponse = response.generate(true,'Error Occured',500,null)
                res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true,'No Blog Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'Blog Deleted Successfully',200,result)
                res.send(apiResponse)
            }
    })
}


module.exports = {
    getAllBlog: getAllBlog,
    viewBlogById: viewBlogById,
    viewByCategory: viewByCategory,
    viewByAuthor: viewByAuthor,
    createBlog: createBlog,
    editBlog: editBlog,
    deleteBlog: deleteBlog,
    increaseBlogView:increaseBlogView,
    testRoute: testRoute,
    testQuery: testQuery,
    testBody: testBody
}