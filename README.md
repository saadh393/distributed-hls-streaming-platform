Hey, I am trying to build an Scale able Node.js Application for Video Streaming Platform. The Application will be Microservice Application.

The Application flow looks like this - User uploads video (Large around 1/2 GB per video), that video is transcoded to HLS video, then Same video can be streams to the User.

The whole project is Dummy and Practice project to Understand and Learn Hands on Project of Node.js Microservice, System Design, Node Multi-threading, Streaming, Queue Messaging and Advanced node js topics. Here is my plan, I want to you validate the plan in the perspective of an Senior Software Engineer, Validate Different Edge case, suggest different senarios to handle.

My Plan -

- API Gateway - This is responsible to Uploading and Watching Video. Uploaded Video will be stored in "Storage Service" (for learning, no 3rd party service right now). User's uploaded video will be stored in "Storage Service".

- Upload Service - For Uploading, User will get a Short live Upload URL though API Gateway Service. Upload Service is Responsible for Uploading the Content though Streaming and Resumeable upload. The the Uploaded content will be merged, virus scanned and moved to Storage Service

- Storage Service - It's the siulation of s3 bucket, so it just stores the video file, Serve as need

- Transcode Service - When video is Uploaded, Transcode Service will Transcode the videos into HLS(different resoulation, separte chunk). When all the chunk are ready store to the Storage Service

- Streaming Service - Using API Gateway, user will get Video Streaming URL, the url will be given to the HLS Player, it will stream/play the video

So that's the plan, I intentionally skipped the s3 bucket. Execpt that, what's wrong and what's right of my Plan, judge it based on the perspective of a Senior Software Engineer. And my goal of the project is to learn how senior engineer design system, though process and core of Node.js
