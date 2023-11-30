//if one function include inside another function then it's called hof(higher order function)
//like map(()={}),forEach,.filter

// catch asycnchronous error
module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            return res.status(500).json({
                message:err.message,
                fullError:err
            })
        })
    }
}
