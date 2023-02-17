import exp from "constants";
import { NextFunction } from "express";
import { Response, Request } from "express";
import { CustomValidator } from "express-validator/src/base";
import { body, validationResult } from 'express-validator';
import{ blogsRepositoryDb} from "../repositories/blogs.repository.db";
import {postsRepositoryDb} from "../repositories/posts.repository.db";

export const findByIdBlogs : CustomValidator = value => {
    let blog = blogsRepositoryDb.getBlogByID(value)
    if (!blog){
        throw new Error('Invalid blogId')
    }
    return true
};

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) =>
{
    const error = validationResult(req)
    if (!error.isEmpty())
    {
        return res.status(400).send({
            errorsMessages: error.array({onlyFirstError: true}).map(e => {
                return {
                     message: e.msg,
                     field: e.param
                }
            })
        })
    }
    next()
}
export const blogValidationMiddleware =
    [
    body('name').trim().isLength({min: 1, max: 15}).isString().withMessage('name incorrect'),
    body('description').trim().isLength({min: 1, max: 500}).isString(),
    body('websiteUrl').trim().isLength({min: 1, max: 100}).matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/).isString(),
];

export const postValidationMiddleware =
    [
    body('title').trim().isLength({min:1, max: 30}).isString(),
    body('shortDescription').trim().isLength({min:1,max:100}).isString(),
    body('content').trim().isLength({min:1, max: 1000}).isString(),
    body('blogId').trim().custom(findByIdBlogs).isString()
];
