# Foma - Forum Mahasiswa 🎓
![Project Status](https://img.shields.io/badge/status-in%20progress-yellow)
![Made with HTML & CSS](https://img.shields.io/badge/made%20with-HTML%20%26%20CSS-orange)

This is a student forum website project for the Front-end Programming Mid-term exam.
*Ini adalah website forum mahasiswa untuk projek UTS mata kuliah Front-end Programming.*

**untuk representasi website terbaik, di rekomendasikan untuk menggunakan Live Server extension di VsCode untuk membuka file html**

---
### ## Table of Contents
* [About The Project](#about-the-project)
* [Screenshots](#screenshots)
* [Key Features](#key-features)
* [Built With](#built-with)
* [Getting Started](#getting-started)
* [Our Team](#our-team)

---
### ## About The Project
**Foma** is a dynamic and responsive student forum designed to be a central hub for university students. Our goal is to create a platform for sharing information, discussing academic topics, and building communities around shared interests and activities (UKM).

This project focuses on creating a clean, intuitive, and mobile-first user interface, while also integrating dynamic content using JavaScript, jQuery, and public APIs to simulate a real-world web application.

---
### ## User Journey (The Plot)
To understand how the website works, let's follow the journey of a fictional student named **Alex**.

1.  **Discovery (As a Guest):** Alex gets a link to **Foma** from a classmate. Upon opening the homepage, Alex can immediately browse the latest discussions and see a list of upcoming campus events. All content is readable without an account.

2.  **Curiosity & Registration:** Alex wants to ask a question about a front-end course. When attempting to create a post, the site prompts Alex to log in. Having no account, Alex clicks "Sign Up," fills out the registration form, and successfully creates a new account.

3.  **Participation (As a Member):** Now logged in, Alex has full access. They navigate to the **Communities** page and find the "Front-End Enthusiasts" group. Inside, Alex can create a new thread, reply to other members' posts, and leave likes.

4.  **Contribution:** Alex hears about a free webinar and wants to share it. They go to the **Events** page and use the "Submit Event" feature. The submission is sent to an administrator for review before it's published for everyone to see.

5.  **Account Management:** Later, Alex wants to review all the questions they've asked. They visit their **Profile** page, which displays a complete history of all their posts and contributions.

---
### ## Directory Structure
```foma-forum-mahasiswa/
├── README.md               # The file you are reading now
├── views/
│   ├── adminpage.html
│   └── community.html          # Community list page
│   └── dashboard.html              # Main page (Homepage/Dashboard)
│   └── history.html
│   └── Login.html              # User login page
│   └── searchPage.html
│   └── signup.html             # User registration page
│   └── Student.html
│   └── threads.html
│   └── userprofile.html            # User profile page
│
└── src/
├── css/
│   ├── adminstyle.css      
│   └── community.css   # Page-specific styles for the community page
│   └── dashboard.css
│   └── historystyle.css
│   └── Login.css
│   └── searchstyle.css
│   └── signuo.css
│   └── Student.css
│   └── style.css
│   └── threads-style.css
│   └── userprofile.css

│
├── js/
│   ├── admin-approval.js       
│   └── admin-content-manajer.js    # Specific script for community page functionality (API, search)
│   └── admin-script.js
│   └── communityscript.js
│   └── dashboard.js
│   └── history.js
│   └── Login.js
│   └── search.js
│   └── signup.js
│   └── Student.js
│   └── threads.js
│   └── userprofile.js
│
└── 
```
---
### ## Key Features
* **User Authentication:** Clean and responsive pages for user Login & Signup.
* **Interactive Functions:** Users can create new communities (simulated with `POST` requests) and search/filter existing ones in real-time.
* **Responsive Design:** The layout is fully responsive and optimized for mobile, tablet, and desktop screens using modern CSS and media queries.
* **Modular Components:** Includes reusable components like a navigation sidebar and content cards.

---
### ## Built With
This project was built using fundamental front-end technologies. No frameworks were used.

* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)

---
### ## Getting Started
To get a local copy up and running, follow these simple steps.

1.  Clone the repository to your local machine:
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    ```
2.  Navigate into the project folder:
    ```sh
    cd your-repository-name
    ```
3.  Open the `index.html` file (or any other HTML page) in your web browser.
    * **Pro Tip:** For the best experience with API calls, we recommend using the **"Live Server"** extension in Visual Studio Code.

---
### ## Our Team
**Group 6 || Kelompok 6:**

| Name                                     | NIM       |
| ---------------------------------------- | --------- |
| nesa28 - Vanesa Yolanda                  | 535240071 |
| Einnyboi - Cathrine Sandrina             | 535240075 |
| Cornelius-27 - Cornelius Clarence        | 535240076 |
| nomii1568 - Naomi William Sugiantara     | 535240078 |
| Jessica Perez Chen                       | 535240188 |
