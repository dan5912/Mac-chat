import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import Message from '../model/message';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/message/add' - Create
  api.post('/add', authenticate, (req, res) => {
    let newMessage = new Message();
    newMessage.messageBody = req.body.messageBody;
    newMessage.userId = req.body.userId;
    newMessage.channelId = req.body.channelId;
    newMessage.userName = req.body.userName;
    newMessage.userAvatar = req.body.userAvatar;
    newMessage.userAvatarColor = req.body.userAvatarColor;

    newMessage.save(err => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Message saved successfully' })
    });
  });

  // '/v1/message/:id' - Update
  api.get('/:body', authenticate, (req, res) => {
    Message.findOne({ 'messageBody' : req.params.body }, (err, message) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ID_TS: message._id.getTimestamp(), TS : message.timeStamp, BODY: message.messageBody});
      //res.status(200).json(message)
    });
  });
  

  // '/v1/message/byChannel/:channelId'.  .sort('timeStamp') .sort('_id')
  api.get('/byChannel/:channelId', authenticate, (req, res) => {
    Message.find( { 'channelId' : req.params.channelId } ).exec((err, messages) => {
        if(err) {
          res.status(500).json({ message: err });
        }
        res.status(200).json(messages);
      });
    });
      
      /*.find({ 'channelId' : req.params.channelId }, (err, messages) => {
        if(err) {
          res.status(500).json({ message: err });
        }
        res.status(200).json(messages);
      });
  });
  .find(
    { 'channelId' : req.params.channelId },
{
    sort:{
        "timeStamp": -1 //Sort by Date Added DESC
    }
},
function(err,allNews){
    socket.emit('news-load', allNews); // Do something with the array of 10 objects
})*/

  // '/vq/message/:id' -Delete
  api.delete('/del/:id', authenticate, (req, res) => {
    Message.remove({
      _id: req.params.id
    }, (err, message) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Message Successfully Removed'});
    });
  });

  // '/v1/message/' - Delete all
  api.delete('/', authenticate, (req, res) => {
    Message.find({}, (err, users) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'Users All Removed'});
    });
  });

  return api;
}
