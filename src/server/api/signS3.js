import aws from 'aws-sdk';

import ServerConstants from '../ServerConstants';

aws.config.region = 'us-east-2';

export default (req, res) => {
  if (!req.query) {
    res.status(400).send({
      err: 'Invalid request to edit settings please make a proper request.'
    });
    return;
  }

  const s3 = new aws.S3();

  const fileType = req.query['file-type'];
  const fileName = req.query['file-name'];

  const fileExtension = fileName.split('.').pop();

  // Ensure the file extension is allowed.
  const regex = /^((jpg)|(png)|(jpeg)|(gif))$/gi;
  
  // Ensure the type of the file is valid.
  if (!regex.test(fileExtension)) {
    res.status(400).send({
      err: 'Invalid image type. Please try a different image or save it as a jpg, png, or gif.'
    });
    return;
  }

  const avatarURL = `avatar/${req.username}.${fileExtension}`;

  const s3Params = {
    Bucket: ServerConstants.S3_BUCKET,
    Key: avatarURL,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      res.status(500).send({
        err: 'Unable to communicate with servers to store your image. Refresh and retry. Please contact one of the site administrators if it still doesn\'t work'
      });
      return;
    }
    const returnData = {
      signedRequest: data,
      url: `https://${ServerConstants.S3_BUCKET}.s3.amazonaws.com/${avatarURL}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
};