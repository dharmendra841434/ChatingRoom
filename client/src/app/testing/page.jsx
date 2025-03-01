"use client";

import axios from "axios";
import React, { useState } from "react";

const Testing = () => {
  const [loading, setLoading] = useState(false);
  const sendNotification = async () => {
    const deviceTokens = [
      "et1wG_iism87THXFzwfK5-:APA91bECgE618rVCOi8qE1nxk0HhHFYd8TV07ZmxsAB3NPxbyD2TKhAxqAJfugraY0gQbMeqJ5f8KBd29CE0aMWxRBILE3LsM_Z7gBU9ywYFHQLGN7fh200",
      "c_9RJ5lTQ42kLOZiqjU3e0:APA91bH27KRJvB7XhfZiuoYH9wCKMu2PpeuEvDJBFwurivLOmSqwXWFdPlG0TlxcyWGxDxqLIEx5BLx88UQ-IDIEZL3DA-r8dUvcWZ7rPJmBLkj_PLvR0FY",
      "fKDReyasQEiOyn-1HlkQcu:APA91bFOMzbXJHsx-6f07xmvEkQcudV5Y1Be2DM3a2M9Lb2LHxW5gWGV6tgVSxqdaQC4A6o0cs-THJEnoFhy63pAd02HT5oTod62uBDtl4RD8wsFC1VAyLo",
    ];

    const notifications = [
      {
        title: "Hello User 1",
        body: "This is a test notification for user 1",
      },
      {
        title: "Hello User 2",
        body: "This is a test notification for user 2",
      },
      {
        title: "Hello User 3",
        body: "This is a test notification for user 3",
      },
    ];

    setLoading(true);

    for (let i = 0; i < deviceTokens.length; i++) {
      const payload = {
        title: notifications[i].title,
        body: notifications[i].body,
        deviceToken: deviceTokens[i],
      };

      console.log(payload, "this is payload");

      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/send-single-notification`,
          payload
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }

    setLoading(false);
  };

  return (
    <div className=" w-full flex items-end justify-center mt-[12%]">
      <button
        disabled={loading}
        onClick={sendNotification}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Send Notifications
      </button>
    </div>
  );
};

export default Testing;
