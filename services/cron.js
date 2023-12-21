
const { CronJob } = require('cron');
const {Op} = require('sequelize');
const common=require("../model/commonmessage")
const chatmessage = require("../model/chatapp")
const ArchivedChatcommon = require('../model/archeived-chat-common');
const ArchivedChatgroup = require('../model/archeived-chat-group');
exports.job = new CronJob(
    '* * * * *', 
    function () {
       
        archiveOldRecordscommon();
        archiveOldRecordsgroup();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldRecordscommon() {
    try {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
     
      
      // Find records to archive
      const recordsToArchive = await common.findAll({
        where: {
          createdAt: {
            [Op.lt]: tenDaysAgo
          },
        },
      });
      
      //Archive records
      await Promise.all(
        recordsToArchive.map(async (record) => {
          await ArchivedChatcommon.create({
            id: record.id,
            message: record.message,
            date: record.date,
            isImage:record.isImage,
            userId: record.userId,
            GroupId: record.GroupId,
            name:record.name
          });
          await record.destroy();
        })
      );
      console.log('Old records archived successfully.');
    } catch (error) {
      console.error('Error archiving old records:', error);
    }
  }
  async function archiveOldRecordsgroup() {
    try {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      // Find records to archive
      const recordsToArchive = await chatmessage.findAll({
        where: {
          createdAt: {
            [Op.lt]: tenDaysAgo
          },
        },
      });
  
      // Archive records
      await Promise.all(
        recordsToArchive.map(async (record) => {
          await ArchivedChatgroup.create({
            id: record.id,
            message: record.message,
            date: record.date,
            isImage:record.isImage,
            userId: record.userId,
            GroupId: record.GroupId,
            name:record.name
          });
          await record.destroy();
        })
      );
      console.log('Old records archived successfully.');
    } catch (error) {
      console.error('Error archiving old records:', error);
    }
  }

// async function archiveOldRecords() {
//     try {
  
//       const fiveMinutesAgo = new Date();
//       fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
  
//       // Find records to archive
//       const recordsToArchive = await ChatHistory.findAll({
//         where: {
//           date_time: {
//             [Op.lt]: fiveMinutesAgo,
//           },
//         },
//       });  
//       await Promise.all(
//         recordsToArchive.map(async (record) => {
//           await ArchivedChat.create({
//             id: record.id,
//             message: record.message,
//             isImage:record.isImage, 
//             date_time: record.date_time,
//             UserId: record.UserId,
//             GroupId: record.GroupId
//           });
//           await record.destroy();
//         })
//       );
//     } catch (error) {
//       console.error('Error archiving old records:', error);
//     }
//   }