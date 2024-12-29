## Getting Started

โปรเจคนี้ใช้ฐานข้อมูล PostgreSQL ซึ่งเลือกใช้เนื่องจากข้อมูลในเว็บไซต์บล็อกมีลักษณะที่มีความสัมพันธ์กันและมีความแน่นอน นอกจากนี้ยังใช้ TypeORM ในการจัดการกับฐานข้อมูลเพื่อเพิ่มความสะดวกในการทำงานและการจัดการข้อมูล

โครงสร้างของโปรเจคถูกออกแบบให้มีการแยกโมดูลออกเป็น 5 โมดูลหลัก ได้แก่ Category, Comment, Auth, Posts, และ Users

โปรเจคนี้มีการ allow cors เพื่อรองตัวโปรเจคส้วน front end ที่รันอยู่ที่ localhost:3000

มีการใช้ class validator เพิ่อมาทํา dto สําหรับ validate ข้อมูลจาก api


เนื่องจากเวลาจํากัดผมมีเขียน test case แค่ในส่วนของตัว post.service.ts เท่านั้น


#First, install depedencies
```bash
npm install

#Copy .env.example to create .env file
cp .env.example .env


#Run Development Server
npm run start:dev

#Run Test
npm run test src/posts/posts.service.spec.ts

