import mongoose from "mongoose";
import Group from "../models/group.model.js";
import { generateRandomString } from "../utils/helper.js";

const getAllGropsOfUser = async (req, res, next) => {
  const userId = req.params.owner;
  const groups = await Group.find({
    allUsers: { $elemMatch: { userId: new mongoose.Types.ObjectId(userId) } },
  });

  // console.log(groups);

  if (groups.length > 0) {
    console.log("done");

    req.rCode = 1;
    req.rData = { groups: groups };
  } else {
    console.log("fails");

    req.rCode = 5;
    req.msg = "groups_not_found";
  }
  next();
};

const createNewGroup = async (req, res, next) => {
  console.log(req.body);

  const { userId, groupName } = req.body;
  let groupKey = generateRandomString(15);

  console.log(
    `userId: ${userId}, groupName: ${groupName}, groupKey: ${groupKey}`
  );

  await Group.create({
    groupKey: groupKey,
    groupName: groupName,
    allUsers: [
      {
        userId: userId,
      },
    ],
    messages: [],
    owner: userId,
  });

  req.rData = { messages: " Group created successfully" };

  next();
};

const joinGroup = async (req, res, next) => {
  //console.log(req.body);

  const { userId, groupKey } = req.body;

  const response = await Group.findOneAndUpdate(
    { groupKey },
    {
      $addToSet: { allUsers: { userId } },
    }
  );
  if (response === null) {
    req.rCode = 5;
    req.msg = "group_not_found";
    return next();
  } else {
    req.rData = { messages: " User Joined successfully" };
  }

  next();
};

export { getAllGropsOfUser, createNewGroup, joinGroup };
