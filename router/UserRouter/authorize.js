const express = require('express')
const fs = require('fs')
const path = require("path")

const userJsonFilePath = path.join(__dirname,"db",'users.json') 


async function authorizeAdmin(req,res,next){
    const role = req.query.role
    console.log(userJsonFilePath)
    fs.readFile(userJsonFilePath,'utf-8',(err,data)=>{
        if(err){
            res.status(404).json({
                message: "internal server error",
                error: true
            })
        }
        const users = JSON.parse(data)
        console.log(users)
        // !const user = users.find(user => user.role == role)
        if(role == "Admin"){
            next()
        }
        else{
            res.status(401).json({
                message: "unauthorized",
                error: true
            })
        }
    }) 
}

async function authorizeUser(req,res,next){
    const role = req.query.role
    console.log(userJsonFilePath)
    fs.readFile(userJsonFilePath,'utf-8',(err,data)=>{
        if(err){
            res.status(404).json({
                message: "internal server error",
                error: true
            })
        }
        const users = JSON.parse(data)
        console.log(users)
        // !const user = users.find(user => user.role == role)
        if(role == "User"){
            next()
        }
        else{
            res.status(401).json({
                message: "unauthorized",
                error: true
            })
        }
    }) 
}


module.exports = {
    authorizeAdmin,
    authorizeUser
}