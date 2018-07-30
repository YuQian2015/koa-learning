const qiniu = require('qiniu');
const fs = require('fs');


const accessKey = 'Y3Yp083X9R5vnYca10N8DkpNq4q1zoxrtNip1Ptf';
const secretKey = '1yVv5hqxplLYoVTwBAJwjV2GWwTSHNDEYu1AE0Iw';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
    scope: 'healthy-diet',
    expires: 7200,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    callbackBodyType: 'application/json'
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const formUploader = new qiniu.form_up.FormUploader(options);
const putExtra = new qiniu.form_up.PutExtra();

// module.exports = (key, readableStream) => {
module.exports = (key, localFile) => {
    console.log("开始上传图片");
    // 文件上传
    // formUploader.putStream(uploadToken, key, readableStream, putExtra, function(respErr,
    //                                                                             respBody, respInfo) {
    //     if (respErr) {
    //         console.log(respErr);
    //         throw respErr;
    //     }
    //     if (respInfo.statusCode == 200) {
    //         console.log(respBody);
    //     } else {
    //         console.log(respInfo.statusCode);
    //         console.log(respBody);
    //     }
    // });


    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
                                                                         respBody, respInfo) {
        if (respErr) {
            throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
};