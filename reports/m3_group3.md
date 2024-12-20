---
title: CMPE 451 Customer Milestone 3 Report - Group 3

---

# CMPE 451 Customer Milestone 3 Report - Group 3


## Executive Summary

### Project Progress

The project has progressed significantly since the last milestone, with the majority of core features fully implemented, tested, and integrated into the platform. User registration, login, password reset, and logout functionalities are all completed, ensuring a secure and user-friendly authentication flow. Core social interaction features—such as following/unfollowing, viewing followers/following lists, liking/disliking posts, commenting, and tagging—have also reached completion or are near completion. The content creation pipeline is largely functional, with users able to create and publish a variety of post types (text, artists, songs, playlists), though a few enhancements remain in progress, such as image uploads and improved tagging capabilities.

### Final Release

The final release is strongly positioned around these completed features, offering a stable baseline experience for end-users. For instance:

- **Integrated Recommendation Engine**: Provides users with personalized music and artist suggestions.
- **Embedded Spotify Players**: Allow for seamless in-platform music playback.
- **Search Functionality**: Searching for artists, users, and playlists is fully operational.
- **Content Filtering**: Users can filter content by various criteria (e.g., songs, artists, playlists, events, users).

These core achievements ensure that the platform’s main value propositions—community engagement, discoverability of music and artists, and a dynamic social environment—are effectively delivered.

### Process Improvement

In terms of process improvement, the team has learned to refine scoping early on. Early in the project, we opted not to prioritize certain requirements, such as event posts and donation functionalities, to ensure focus on the most critical user-facing features. This decision streamlined development efforts and helped deliver a more polished core product. Additionally, after previous milestones, the team introduced more rigorous code reviews and integrated continuous testing to reduce regressions and improve the quality of each release. These changes resulted in fewer last-minute fixes and a more predictable development cycle.

### Lessons Learned

Reflecting on the final milestone demo, one key lesson learned is the importance of balancing breadth and depth of feature implementation. While we successfully rolled out a wide range of features, more attention to UX polishing and thorough documentation at the outset could have accelerated final integrations and reduced rework. For example, a clearer initial definition of how tagging or accessibility standards would be integrated could have minimized the need for later adjustments. Investing more heavily in initial design specifications—particularly around user journeys, accessibility requirements, and the integration of event-related features—could have saved time and effort, ensuring a smoother path to finalization.
Giving more importance to WikiData in the search functionality and the general foundation of the application and proceeding based on this could have taken us to a better point. In general, proceeding based on tagging and the things we were told in class and lab could have opened up an easier path for us to produce a truly beautiful application. These could be things we could have done differently.

### Conclusion

Overall, the project is on track for a robust final release, with critical functionalities completed and remaining items clearly identified for refinement or future development. The changes made to our development practices, along with these reflections, will guide improvements not only for the conclusion of this project but also for future initiatives.


---

## Progress Based on Teamwork

### Summary of Team Contributions
| Team Member       | Role           | Responsibilities                      | Contributions Summary |
|--------------------|----------------|---------------------------------------|------------------------|
| Abdullah Enes Gules   | Mobile | Responsible for brainstorming ideas and developing the mobile application with Enes, including implementing features, fixing issues, and writing unit tests. | Contributed to milestone reports, mobile development, API integrations, and wrote unit tests. |
| Onur Dilsiz       | Frontend  | Responsible for the communication in the frontend team, developing key features, resolving bugs. Collaborated closely with the backend team. | Implemented the most of the key features in the web application. Fixed requirements and backend endpoint bugs. Ensured high-quality code through testing and reviews. |
| Ekrem BAL       | Frontend  | Responsible for the communication in the frontend team, developing key features, resolving bugs. Collaborated closely with the backend team. | Implemented the most of the key features in the web application. Fixed requirements and backend endpoint bugs. Ensured high-quality code through testing and reviews. |
| Enes Sait Besler | Mobile | 	Built the mobile app with working with Abdullah. Took meeting notes, helped prepare lab reports, and attended all lectures to keep track of project needs. Improved the app’s UI/UX, connected APIs, and made sure the design works on different devices. Helped fix and enhance features based on user feedback. | Built key parts of the mobile app, made feature integrations easier, improved code by testing, helped with brainstorming and writing reports, and kept the team informed and aligned with project goals. |
| Esad Yusuf Atik       | Backend & DevOps  | Responsible for the communication in the backend team, developing key features, resolving bugs. Also responsible for all things related to the deployment of the project. | Took initiative to outline the features in the application and ensured cooperation between team members. Developed features for the backend. Wrote the API documentation. |
| Jorge Velázquez Jiménez      | Frontend  | Responsible of the Standards correct use and member of the frontend team | Implemented some features of the web application and standarized it. Wrote Standards documentation and unit tests |
| Ahmet Burkay Kınık | Backend  | Responsible for the design of the backend and the development of key features and resolving of the bugs. Also responsible for part of the data population | Implemented parts of the backend, especially the post creation and search endpoints and implemented the data creation scripts. Wrote the all encompassing user scenario. |
| Yusuf Suat Polat | Backend  | Responsible for the design of the backend and the development of key features and resolving of the bugs. Also responsible for part of the testing and Spotify integration | Implemented parts of the backend, especially the post creation and Spotify retrieval. Implemented the endpoints for such functionalities. |


### Status of Requirements
| Requirement                        | Status       | Notes/Details                                             |
|------------------------------------|--------------|-----------------------------------------------------------|
| **1.1.1** Users shall register for an account by providing necessary information, including **name**, **username**, **email**, and **password**. | Completed    | Registration form implemented with input validation.      |
| **1.1.2** Users shall choose their user categories. |Completed  | Categories dropdown is implemented but requires refinement. |
| **1.2.1** Users shall log in to the system using their **username** and **password**. | Completed    | Login functionality is fully operational.                 |
| **1.2.2** Users shall be able to securely **reset their passwords**. | Completed    | Password reset via email link is implemented.             |
| **1.2.3** Users shall be able to log out. | Completed    | Logout functionality is fully operational.                |
| **2.1.1** Users shall be able to **view** and **update** their profile information, including their name, username, email, and selected user categories. | In Progress    | Profile page supports view functionality, but does not support edit.         |
| **2.2.1** Users shall be able to **follow** and **unfollow** other users. | Completed    | Follow/unfollow buttons are implemented with backend integration. |
| **2.2.2** Users shall be able to **view their list of followers** and the users they are **following**. | In Progress  | UI is not implemented.    |
| **3.1.1** Users shall be able to **create and publish posts** containing text, images, links, and embedded Spotify playlists. | Completed    | Post creation does not support images yet.       |
| **3.1.1.1** Users shall be able to create event posts. | Not started    | Spotify API does not give information about events so we opted not to proceed with this item.    |
| **3.1.1.2** Users shall be able to create artist posts. | Completed   | Fully operational.  |
| **3.1.1.3** Users shall be able to create song posts. | Completed    | Song-specific post creation is operational.               |
| **3.1.1.4** Users shall be able to create playlist posts. | Completed    | Playlist embedding and sharing is fully functional.       |
| **3.1.2** Users shall be able to **tag their posts** with relevant tags for better discoverability. | In progress    | Backend has some tag implementation. However, they are not implemented in UI.          |
| **3.2.1** Users shall be able to **like** or **dislike** posts. | Completed    | Like/dislike buttons are operational.                     |
| **3.2.2** Users shall be able to **comment** on posts made by other users. | Completed  | Fully functional. |
| **3.2.3** Users shall be able to **view posts**, **likes**, and **comments** made by themselves and other users. | Completed    | Posts with engagement data are displayed in the feed.     |
| **4.1.1** Users shall see **music and artist recommendations** based on the music or artist they are viewing. | Completed    | Recommendation engine integrated with the feed.           |
| **4.1.2** Users shall be able to **play music** directly through embedded Spotify players within the platform. | Completed    | Spotify embedding works in posts.              |
| **5.1.1** Users shall be able to securely **donate to artists** through the platform. | Not Started  | Decided not to prioritize this item.                  |
| **5.1.2** Users shall be able to enter their wallet addresses. | Not started    | Decided not to prioritize this item.            |
| **6.1.1** Users shall be able to **search for music** categorized by genres and music styles. | In Progress  | Basic genre search implemented; advanced filters pending. |
| **6.2.1** Users shall be able to **search for artists and other users** to connect with them. | Completed    | Search bar with filtering options is fully functional.    |
| **6.3.1** Users shall be able to **filter content** based on categories (**songs**, **artists**, **playlists**, **events**, **users**). | Completed  | Fully operational. |
| **6.4.1** Users shall be able to apply advanced filters using **tags** and **popularity metrics**. | In Progress  | Tagging, popularity filters under development.                     |
| **7.1.1** Users shall visually access and navigate all features independently with the platform to be compatible with screen reading software. | In Progress  | Accessibility improvements ongoing.                       |


### API Endpoints
Our API documentation can be found in our Wiki. 

[Link to our API Docs](https://github.com/bounswe/bounswe2024group3/wiki/API-Documentation)

[In this file](https://github.com/bounswe/bounswe2024group3/blob/main/backend/music_app/urls.py) and in [this file](https://github.com/bounswe/bounswe2024group3/blob/main/backend/api/views.py), API endpoints and their functionality is defined, respectively.

#### API Examples

1. [Like Post endpoint example](https://github.com/bounswe/bounswe2024group3/blob/main/backend/api/views.py)
2. [Save now playing example](https://github.com/bounswe/bounswe2024group3/blob/main/backend/api/views.py)
3. [Most listened nearby example](https://github.com/bounswe/bounswe2024group3/blob/main/backend/api/views.py)

### User Interface / User Experience
- Links to UI design code in the repository

> For the web, we use tailwindcss with daisy ui, so most of our ui design code are seperated in components. You can see components that are used here: https://github.com/bounswe/bounswe2024group3/tree/main/web/src/components
- Screenshots of all implemented web and mobile interfaces

Screenshots of all web interfaces:
![Screenshot 2024-12-20 at 19.28.14](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.28.14.png?raw=true)
![Screenshot 2024-12-20 at 19.28.27](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.28.27.png?raw=true)
![Screenshot 2024-12-20 at 19.28.37](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.28.37.png?raw=true)
![Screenshot 2024-12-20 at 19.28.48](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.28.48.png?raw=true)
![Uploading file..._dgfrtyf9g](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.29.09.png?raw=true)
![Screenshot 2024-12-20 at 19.29.33](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.29.33.png?raw=true)
![Uploading file..._uol7mcg0e](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.29.54.png?raw=true)
![Uploading file..._vgtw78w3h](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.03.png?raw=true)
![Screenshot 2024-12-20 at 19.30.10](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.10.png?raw=true)
![Screenshot 2024-12-20 at 19.30.18](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.18.png?raw=true)
![Uploading file..._k0s48xnru](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.25.png?raw=true)
![Screenshot 2024-12-20 at 19.30.33](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.33.png?raw=true)
![Uploading file..._mg46cw3dr](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.42.png?raw=true)
![Screenshot 2024-12-20 at 19.30.55](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.30.55.png?raw=true)
![Screenshot 2024-12-20 at 19.31.14](https://github.com/bounswe/bounswe2024group3/blob/main/images/Screenshot%202024-12-20%20at%2019.31.14.png?raw=true)

![WhatsApp Image 2024-12-20 at 20 46 14](https://github.com/user-attachments/assets/249217d4-8360-45fb-af57-6a958ccec66b)

![5](https://github.com/user-attachments/assets/7c946795-99e2-40bb-95b2-73a19fdba0f5)
![6](https://github.com/user-attachments/assets/b96f22ac-a14f-4e89-b79f-b1fdc566ce46)
![7](https://github.com/user-attachments/assets/f1a49003-5c40-48cc-a80f-57b930fe2708)
![8](https://github.com/user-attachments/assets/471269d7-67d8-407d-a98e-cbb324136f4b)
![9](https://github.com/user-attachments/assets/6b8ac962-387f-4b67-adf6-05a5dee303c7)
![10](https://github.com/user-attachments/assets/ca142738-8e0d-4bd2-8489-97226ca44390)
![11](https://github.com/user-attachments/assets/163f138f-0ae0-4607-abf3-6c3bc95800fa)
![12](https://github.com/user-attachments/assets/eabd0ff8-4879-4fd5-a93d-7e7084eb543f)
![1](https://github.com/user-attachments/assets/a11f9825-c6f2-4868-b94f-0b438328a962)
![2](https://github.com/user-attachments/assets/de1ab8a8-f7c3-465a-a2b5-8cafdd106cb9)
![3](https://github.com/user-attachments/assets/9bc1a000-7994-4500-af9c-fbe61be03cf4)
![4](https://github.com/user-attachments/assets/a6e610f0-a242-45c8-8b9d-ec06cfec4efa)

### Standards Compliance
#### Overview of WAI-ARIA

WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications) is a set of standards developed by the W3C. It defines roles, states, and properties to enhance the accessibility of dynamic web applications. These standards allow assistive technologies to interpret the content and functionality of web applications more effectively, ensuring a more inclusive experience for users with diverse disabilities.

#### Implemented WAI-ARIA Attributes

##### `aria-label`
Provides an accessible name for elements without visible text.

**Example:**
```html
<button aria-label="Submit form">✔</button>
```

##### `aria-labelledby`
Associates elements with other elements that provide their label.

**Example:**
```html
<label id="username-label">Username</label>
<input id="username" aria-labelledby="username-label" type="text" />
```

##### `aria-hidden`
Indicates that an element should be ignored by assistive technologies.

**Example:**
```html
<div aria-hidden="true">Decorative content</div>
```

#### Efforts Undertaken

##### Implementation of WAI-ARIA Attributes
We applied the mentioned attributes to interactive components on our platform to ensure proper interpretation by assistive technologies.

##### Accessibility Testing
We conducted tests using assistive tools to verify that the WAI-ARIA attributes are correctly implemented and improve the user experience for individuals with disabilities.

##### Documentation and Continuous Improvement
We maintain updated documentation on the use of WAI-ARIA in our project and continuously strive to enhance the accessibility of our platform.

#### Conclusion
These efforts demonstrate our commitment to accessibility and compliance with web standards, ensuring a more inclusive user experience in SpotOn.

For more details, here is our [WAI-ARIA Documentation](https://github.com/bounswe/bounswe2024group3/wiki/WAI‐ARIA-Documentation).


### Scenario

#### The All-Encompassing Scenario
 A student, Gökçe is an avid listener of music and would like to know what other people think of the music she is currently listening to. She registers on the Spot On app and starts using the Tapp. She searches for the music she likes, “Shape of You”, through the search bar and finds the page. She finds a simple description of the music from AI and reads the lyrics for the music.
	From then on, she starts reading people’s comments and finds one interesting from ekremmmbal. She likes the comment, wonders what this other person likes, and goes to his page. She reads his posts and then stumbles across the playlists ekremmmbal has created. She really likes one and decides to follow ekremmmbal. Also, she wonders how his playlists are there to begin with. Then, she goes to her own profile page and sees that she needs to connect her Spotify to the app. She clicks on the Connect Spotify button and successfully connects her account.
	After this, she decides to explore the main page and sees the most listened nearby and wonders what the map button does. She clicks on it and finds the most listened songs in any place of the world.
	Having felt like she discovered around her way through the way, she feels like a part of the community and decides to contribute to an artist’s page she knows a lot about. Then, she searches and finds Pink Floyd’s page and leaves a comment about how the album The Wall is a circle and starts with “...we came in” and ends with “isn’t this where we…”, and also how the Live at Pompeii version of “A Saucerful of Secrets” and “Careful with that Axe, Eugene” are better than the originals.
	She likes the app so much that she invites her friends to use the app and they follow each other on the app. From then on, they watch what the others think about through the “Following” section in the main page. Then, they notice the “Fun Quiz” and give it a try. After getting to know it, they decide to use it as an icebreaker during the New Years’ Party they are organizing.
    
#### 


---

# Individual Contributions

## Member: (You can use as a template)
### Responsibilities

### Main Contributions
-
### Code-Related Significant Issues
- 
### Management Related Significant Issues
- 
### Pull Requests 
#### Created
- 
#### Reviewed
- 
#### Merged
- 
### Unit Tests
- List all unit tests you personally wrote, detailing the functionalities they cover.
- 
### Additional
- 

## Member: Abdullah Enes Güleş
### Responsibilities
I was responsible for brainstorming project ideas and features with my group and developing the mobile application with Enes, including tasks like adding new features, fixing issues, and testing.

### Main Contributions
- I created issues for mobile development and milestone roadmap.  
- I joined group discussions and helped with project design.  
- I researched the domain and technologies we can use for the project.  
- I wrote the Milestone 3 report to document our progress.  
- I tracked Milestone 3 tasks to make sure everything was on time.  
- I worked on the final presentation for Milestone 3.  
- I updated the glossary based on assistant’s comments.  
- I created the main README file to explain the project.  
- I wrote tests for updated mobile pages.  
- I added the feature to display song suggestions on mobile.
- I worked on showing descriptions of tracks on the app.
- I built the APK to prepare for mobile deployment.
- I fixed the search page to work with the new endpoint.
- I wrote the main features for Lab 8.  
- I helped coordinate tasks to complete milestone goals.  
- I reviewed and gave feedback on pull requests and issues.  
- I shared ideas during design meetings to improve the project.  

### Code-Related Significant Issues
- [Build the APK](https://github.com/bounswe/bounswe2024group3/issues/611)
- [Write tests for updated mobile pages](https://github.com/bounswe/bounswe2024group3/issues/609)
- [Display song suggestions](https://github.com/bounswe/bounswe2024group3/issues/580)
- [Show descriptions of tracks](https://github.com/bounswe/bounswe2024group3/issues/579)
- [Fix the search page for the new endpoint](https://github.com/bounswe/bounswe2024group3/issues/576)
- [Clean up the repo](https://github.com/bounswe/bounswe2024group3/issues/496)

### Management Related Significant Issues
- [Create the Milestone 3 report](https://github.com/bounswe/bounswe2024group3/issues/614)
- [Track Milestone 3 progress](https://github.com/bounswe/bounswe2024group3/issues/497)
- [Write primary features for Lab 8](https://github.com/bounswe/bounswe2024group3/issues/488)
- [Prepare the final presentation](https://github.com/bounswe/bounswe2024group3/issues/509)
- [Modify the glossary based on assistant's comments](https://github.com/bounswe/bounswe2024group3/issues/501)
- [Create the main README file](https://github.com/bounswe/bounswe2024group3/issues/500)

### Pull Requests 
#### Created
- [Updated tests for mobile pages](https://github.com/bounswe/bounswe2024group3/pull/608)  
- [Fixed incorrect post titles](https://github.com/bounswe/bounswe2024group3/pull/597)  
- [Added back button to profile pages](https://github.com/bounswe/bounswe2024group3/pull/596)  
- [Implemented song suggestions and descriptions](https://github.com/bounswe/bounswe2024group3/pull/581)  
- [Fixed search page to fit updated endpoint](https://github.com/bounswe/bounswe2024group3/pull/571)  
- [Created main README and cleaned up repo](https://github.com/bounswe/bounswe2024group3/pull/558)  
- [Modified environment variable access](https://github.com/bounswe/bounswe2024group3/pull/502)  

#### Reviewed
- [Create post functionality](https://github.com/bounswe/bounswe2024group3/pull/503)  
- [Lyrics quiz feature](https://github.com/bounswe/bounswe2024group3/pull/546)  
- [Show lyrics button](https://github.com/bounswe/bounswe2024group3/pull/548)  
- [Most shared nearby feature](https://github.com/bounswe/bounswe2024group3/pull/557)  
- [Like/dislike connection](https://github.com/bounswe/bounswe2024group3/pull/568)  
- [Get user posts](https://github.com/bounswe/bounswe2024group3/pull/575)  
- [Include username during login](https://github.com/bounswe/bounswe2024group3/pull/582)  
- [Follow/unfollow functionality](https://github.com/bounswe/bounswe2024group3/pull/583)  
- [Get following posts](https://github.com/bounswe/bounswe2024group3/pull/595)  
- [Profile screen unit tests](https://github.com/bounswe/bounswe2024group3/pull/587)  
- [Unit tests for Most Listened/Shared Nearby screens](https://github.com/bounswe/bounswe2024group3/pull/588)  
- [Unit tests for Song Quiz screen](https://github.com/bounswe/bounswe2024group3/pull/589)  
#### Merged
- [Create post functionality](https://github.com/bounswe/bounswe2024group3/pull/503)  
- [Lyrics quiz feature](https://github.com/bounswe/bounswe2024group3/pull/546)  
- [Show lyrics button](https://github.com/bounswe/bounswe2024group3/pull/548)  
- [Most shared nearby feature](https://github.com/bounswe/bounswe2024group3/pull/557)  
- [Like/dislike connection](https://github.com/bounswe/bounswe2024group3/pull/568)  
- [Get user posts](https://github.com/bounswe/bounswe2024group3/pull/575)  
- [Include username during login](https://github.com/bounswe/bounswe2024group3/pull/582)  
- [Follow/unfollow functionality](https://github.com/bounswe/bounswe2024group3/pull/583)  
- [Get following posts](https://github.com/bounswe/bounswe2024group3/pull/595)  
- [Profile screen unit tests](https://github.com/bounswe/bounswe2024group3/pull/587)  
- [Unit tests for Most Listened/Shared Nearby screens](https://github.com/bounswe/bounswe2024group3/pull/588)  
- [Unit tests for Song Quiz screen](https://github.com/bounswe/bounswe2024group3/pull/589)  
### Unit Tests

#### File: `index.test.tsx`
- **Tests for fetching posts:**
  - Verified that `fetchAllPosts` is called on component mount and displays the posts correctly.
  - Ensured the "All Posts" button triggers the `fetchAllPosts` function.
  - Confirmed that `fetchFollowingPosts` is called when pressing the "Following" button.
  - Validated the error message appears if the posts data is not an array.
  - Displayed an error message when the request to fetch posts fails.

- **Tests for UI interactions:**
  - Checked the theme toggling functionality by pressing the theme icon in `App`.
  - Verified the back button navigates correctly in `App`.

- **Tests for modals:**
  - Ensured the "Create a New Post" modal appears when the floating action button is pressed.
  - Verified the modal closes and `fetchAllPosts` is called after submitting a post.

#### File: `recommendations.test.tsx`
- **Tests for fetching posts:**
  - Confirmed that `CombinedPosts` fetches and displays random posts on mount.
  - Verified the data source correctness for random posts and displayed valid comments.
  - Validated the error message appears if the posts data is not an array.
  - Displayed an error message when the request to fetch posts fails.

- **Tests for UI interactions:**
  - Checked the theme toggling functionality by pressing the theme icon in `CombinedPosts`.
  - Tested the refresh button to reload posts in the `CombinedPosts` component.

- **Mocking and error handling:**
  - Used mocked Axios calls to simulate API interactions and ensure proper handling of successful and failed requests.
  - Ensured environment variables like `EXPO_PUBLIC_REACT_APP_BACKEND_URL` are correctly used in tests.
### Additional
- We really worked hard on this project, especially on the final milestone and I think the product we have in the end is really beautiful and actually useful. I would use it :) and I think this is the most important part of a project. I am happy we achieved what we did here.
- This group really became friends through the highs and lows of the course. During the labs, we were the group who laughed the most probably :D 

## Member: Batuhan Solmaz


## Responsibilities
I was responsible for implementing both backend and frontend functionalities for the project. My tasks included integrating external APIs, improving UI/UX, fixing bugs, and enhancing core backend functionality. 

---

## Main Contributions

### Code-Related Significant Issues
Below is a list of significant issues I contributed to and resolved:

- **[Backend]: [Lyrics quiz tests](https://github.com/bounswe/bounswe2024group3/issues/616)**  
  Implemented backend functionality for generating and testing lyric quizzes.

- **[Backend]: [Spotify embed tests](https://github.com/bounswe/bounswe2024group3/issues/615)**  
  Added tests for Spotify embed features to ensure seamless functionality.

- **[Web]: [Write search page](https://github.com/bounswe/bounswe2024group3/issues/562)**  
  Developed a comprehensive search page for the web, integrating enhanced functionality.

- **[Web]: [Add music to playlist in web-related functionalities](https://github.com/bounswe/bounswe2024group3/issues/537)**  
  Added the ability to integrate music into playlists on the web interface.

- **[Web]: [Add show playlists in user pages](https://github.com/bounswe/bounswe2024group3/issues/536)**  
  Implemented functionality to display user playlists on their profile pages.

- **[Backend]: [Write fetch profiles of user, artist, albums code in backend](https://github.com/bounswe/bounswe2024group3/issues/520)**  
  Created backend functionality to fetch user, artist, and album profiles.

- **[Backend]: [Write search from Spotify functions](https://github.com/bounswe/bounswe2024group3/issues/519)**  
  Developed backend functions for searching content on Spotify.

- **[Backend]: [Write lyrics quizzes](https://github.com/bounswe/bounswe2024group3/issues/517)**  
  Integrated the functionality to generate quizzes based on song lyrics.

- **[Backend]: [Write fetch lyrics related functionalities](https://github.com/bounswe/bounswe2024group3/issues/516)**  
  Developed backend features for fetching lyrics from external sources.

- **[Backend]: [Added track, album, track suggestion with OpenAI](https://github.com/bounswe/bounswe2024group3/issues/512)**  
  Leveraged OpenAI for providing music suggestions.

### Management-Related Significant Issues
- **Improved Team Collaboration:** Regularly coordinated with team members to align backend and frontend efforts, ensuring seamless integration.
- **Testing Coverage:** Enhanced testing coverage across both backend and frontend components.

---

## Pull Requests
Below is a summary of my pull requests:

1. **[Fixed import error](https://github.com/bounswe/bounswe2024group3/pull/613)**  
   Resolved import-related issues to ensure functionality.

2. **[Web lyrics quiz](https://github.com/bounswe/bounswe2024group3/pull/612)**  
   Added a web-based lyrics quiz feature for user interaction.

3. **[Fixed redirect endpoint](https://github.com/bounswe/bounswe2024group3/pull/593)**  
   Fixed critical issues with redirect endpoints to improve UX.

4. **[Improved search page with Spotify search](https://github.com/bounswe/bounswe2024group3/pull/569)**  
   Enhanced the search functionality by integrating Spotify API.

5. **[Added Spotify search to web](https://github.com/bounswe/bounswe2024group3/pull/566)**  
   Implemented Spotify search functionality on the web interface.

6. **[Fetch users' followings posts](https://github.com/bounswe/bounswe2024group3/pull/563)**  
   Developed features to fetch and display user-related posts.

7. **[Fixed backend bug](https://github.com/bounswe/bounswe2024group3/pull/561)**  
   Resolved backend issues impacting functionality.

8. **[Fixed backend search endpoint and improved visualization in frontend](https://github.com/bounswe/bounswe2024group3/pull/559)**  
   Improved backend search and corresponding frontend representation.

9. **[Added artist and album suggestions](https://github.com/bounswe/bounswe2024group3/pull/540)**  
   Enhanced recommendation system with artist and album suggestions.

10. **[Wrote playlist-related pages](https://github.com/bounswe/bounswe2024group3/pull/533)**  
    Developed playlist management features for the web interface.

11. **[Frontend and backend of Spotify authentication](https://github.com/bounswe/bounswe2024group3/pull/532)**  
    Integrated Spotify authentication with backend and frontend.

12. **[Added fetch lyrics, quizzes, and Spotify search](https://github.com/bounswe/bounswe2024group3/pull/515)**  
    Combined functionalities for lyrics, quizzes, and Spotify search.

13. **[OpenAI integration](https://github.com/bounswe/bounswe2024group3/pull/511)**  
    Integrated OpenAI API for generating recommendations.

---

## Unit Tests
- **[Lyrics Quiz Tests](https://github.com/bounswe/bounswe2024group3/issues/616):** Implemented and verified functionality through extensive unit tests.
- **[Spotify Embed Tests](https://github.com/bounswe/bounswe2024group3/issues/615):** Ensured Spotify features were robust and error-free.

---


## Member: Onur Dilsiz
### Responsibilities
- I was responsible for the development of front-end part of the application. Mostly, I was in charge of the communication in the front-end team.
- Participated in discussions and decision-making processes regarding project roadmap.
- Conducted code reviews, and merges to ensure consistency and maintainability of the project.
- Wrote and executed unit tests to improve test coverage and reliability of the application.
- Designed, implemented, and maintained key features for user interaction and engagement.

### Main Contributions
#### Backend Enhancements:
- Fixed issues in the `requirements.txt` and `docker-compose` files.
- Debugged and resolved inaccuracies in the "most listened nearby" endpoint, improving data accuracy and system reliability.

#### Frontend Feature Development:
- **Map Page**: Developed a map page with interactive tagging, radius visualization, and integration with backend endpoints for fetching location-based content.
- **Following Posts Tab**: Added a "Following" tab to the feed page, allowing users to view posts only from accounts they follow.
- **Lyrics Integration**: Integrated a feature to display lyrics on song-related posts, enriching the user experience.
- **Profile Page**: Designed and implemented a dynamic profile page with user information, posts, and additional features like follow/unfollow.
- Implemented the "Most Shared Nearby" bar to showcase popular shared content based on location.
- Improved the layout and functionality of the feed page with better navigation and tabbed content.

#### Testing:
- Added unit tests for the Map Page.
- 
### Code-Related Significant Issues

- **[[Backend]: Fix the requirements, and docker-compose files](https://github.com/bounswe/bounswe2024group3/issues/521)**

- **[[Bug report]: Fix most listened nearby endpoint ](https://github.com/bounswe/bounswe2024group3/issues/538)**

- **[[Web]: add map page](https://github.com/bounswe/bounswe2024group3/issues/550)**
- **[[Web]: Add following posts tab ](https://github.com/bounswe/bounswe2024group3/issues/564)**
 - **[[Web]: Add test for Map Page](https://github.com/bounswe/bounswe2024group3/issues/606)**
  - **[[Web]: Show lyrics on song posts](https://github.com/bounswe/bounswe2024group3/issues/394)**
 - **[[Web]: add most shared bar](https://github.com/bounswe/bounswe2024group3/issues/547)**
 - **[[Web]: Profile page](https://github.com/bounswe/bounswe2024group3/issues/398)**



### Management Related Significant Issues
-  **[[Wiki]: Write checklist for domain-specific features](https://github.com/bounswe/bounswe2024group3/issues/492)**
-  **[[Deliverable]: Write primary features](https://github.com/bounswe/bounswe2024group3/issues/488)**
### Pull Requests 
#### Created
-   **[Add test for Map Page](https://github.com/bounswe/bounswe2024group3/pull/607)**
-   **[add following tab to feed page](https://github.com/bounswe/bounswe2024group3/pull/565)**
-   **[add map page](https://github.com/bounswe/bounswe2024group3/pull/551)**
-   **[most shared things](https://github.com/bounswe/bounswe2024group3/pull/542)**
-   **[fix most listened](https://github.com/bounswe/bounswe2024group3/pull/539)**
-   **[add profile page, closes #334, #398, #399](https://github.com/bounswe/bounswe2024group3/pull/527)**
-   **[add lyrics component](https://github.com/bounswe/bounswe2024group3/pull/524)**
-  **[fix the requirements, and docker files closes #521](https://github.com/bounswe/bounswe2024group3/pull/522)**
-  **[Batuhan/artist album suggestion ](https://github.com/bounswe/bounswe2024group3/pull/543)**
#### Reviewed, Merged
-   **[Fix lyrics bar width](https://github.com/bounswe/bounswe2024group3/pull/605)**
-   **[Improve quiz page and add to navbar](https://github.com/bounswe/bounswe2024group3/pull/603)**
-   **[Add pagination on feed page](https://github.com/bounswe/bounswe2024group3/pull/601)**
-  **[fix the requirements, and docker files closes #521](https://github.com/bounswe/bounswe2024group3/pull/522)**
-  **[better prod env var management](https://github.com/bounswe/bounswe2024group3/pull/591)**
### Unit Tests
- Wrote unit test for the Map Page functions.

---


## Member: Ekrem BAL
### Responsibilities
I was responsible for the frontend, pagination, quiz page.
### Main Contributions
In this milestone, my primary contributions include the implementation of the Fun Quiz feature, which serves as an engaging and entertaining component of the project. Additionally, I introduced pagination to improve the user experience and enhance navigability for large datasets. I also resolved several critical bugs, ensuring smoother functionality and a more polished application. Finally, I played a key role in creating the release, consolidating all contributions into a stable and deliverable version for end-users. Helped Milestone report, wrote User manual and added screen shots for the web.
### Code-Related Significant Issues
- [[Web]: Create quiz page #498
](https://github.com/bounswe/bounswe2024group3/issues/498)
- [[Web] Add pagination on feed page #600](https://github.com/bounswe/bounswe2024group3/issues/600)
- [[Web] Guess the correct track quiz #602](https://github.com/bounswe/bounswe2024group3/issues/602)
- [[bug] Lyrics bar fills the page #604](https://github.com/bounswe/bounswe2024group3/issues/604)
- [[Wiki] Add screenshots to the wiki #622](https://github.com/bounswe/bounswe2024group3/issues/622)

### Management Related Significant Issues
- 
### Pull Requests 
#### Created
- [Lab 8 #499](https://github.com/bounswe/bounswe2024group3/issues/499)
- [Add pagination on feed page #601](https://github.com/bounswe/bounswe2024group3/issues/601)
- [Improve quiz page and add to navbar #603](https://github.com/bounswe/bounswe2024group3/issues/603)
- [Fix lyrics bar width #605](https://github.com/bounswe/bounswe2024group3/issues/605)
- [Add screenshots for web #623](https://github.com/bounswe/bounswe2024group3/issues/623)

#### Reviewed
- [Fix backend only Docker Compose #592](https://github.com/bounswe/bounswe2024group3/pull/592)
- [Add test for Map Page #607](https://github.com/bounswe/bounswe2024group3/pull/607)

#### Merged
- [Fix backend only Docker Compose #592](https://github.com/bounswe/bounswe2024group3/pull/592)
- [Add test for Map Page #607](https://github.com/bounswe/bounswe2024group3/pull/607)

### Unit Tests

#### `req` Utility Function
These tests cover the `req` function, which makes HTTP requests using Axios.

1. **POST Request and Response Handling**
   - Ensures the `req` function can successfully make a POST request and return the response data.
   - Mocked environment variable `REACT_APP_BACKEND_URL` is used for the backend URL.

2. **GET Request and Response Handling**
   - Verifies that the `req` function can make a GET request and return the response data correctly.

3. **Error Handling for HTTP Status 403**
   - Confirms that the `req` function throws an error with the correct message when receiving a 403 status code.

4. **Error Handling for Response Data Errors**
   - Ensures that the `req` function throws an error when the response contains an error field in the data.


#### `createSpotifyLink` Function
These tests cover the `createSpotifyLink` function, which generates Spotify links from `id` and `type`.

1. **Valid Track Link**
   - Checks if the function generates a valid Spotify link for a track.

2. **Valid Playlist Link**
   - Verifies that the function generates a valid Spotify link for a playlist.

3. **Valid Album Link**
   - Ensures that the function generates a valid Spotify link for an album.

4. **Missing Type**
   - Confirms that the function throws an error when the `type` is missing.

5. **Missing ID**
   - Ensures that the function throws an error when the `id` is missing.

6. **Missing Both Type and ID**
   - Validates that the function throws an error when both the `type` and `id` are missing.

7. **Unexpected Type Handling**
   - Ensures that the function handles unexpected type values gracefully by incorporating them into the link.

### Additional
In general i am proud of our frontend given the restrictions around spotify embeds.

---
## Member: Enes Sait Besler - Mobile


## Responsibilities

My primary responsibilities within the project centered on the mobile application’s functionality, user experience, and integration with backend services. I was tasked with implementing and refining critical features that enhance user engagement—such as post creation, user profile views, follow/unfollow functionality, seeing following posts, song lyrics quiz and nearby music datas for this milestone. In addition to feature development, I took on responsibilities related to quality assurance by writing and maintaining unit tests to ensure reliable performance. I also contributed to the management side of the project by assisting in organizing team deliverables, planning project presentations, and documenting important team decisions through meeting notes.

**Overall, my responsibilities included:**

- Designing and implementing new features on the mobile platform
- Ensuring seamless integration of backend APIs into the mobile frontend
- Enhancing and maintaining code quality with unit tests and code reviews
- Assisting with management tasks, including planning presentations and documenting meeting outcomes
- Supporting end-to-end testing strategies and continuous improvement initiatives

---

## Main Contributions

### Feature Implementation and Integration

I played a significant role in the creation and enhancement of multiple features for the mobile application. My contributions included:

- Implementing a user profile screen that dynamically fetches user details and displays user-generated posts
- Integrating functionality for creating and interacting with posts—like/dislike features, showing lyrics on Posts
- Ensuring that the system could retrieve “Most Listened” and “Most Shared” music data from nearby sources
- Introducing dynamic routing for user profiles. Implementing follow-unfollow profile functionaly.
- Integrating backend services for content fetching and state management through AsyncStorage
- Implemented Song lyrics quiz and add features to customize this quiz for the users.

### User Experience and Interface Improvements

I developed the **Create Post Modal** and a **floating action button** component, both designed to provide a smooth and intuitive user experience. Through these components, users can:

- Quickly share new content
- Browse their feed
- Navigate their profiles seamlessly

### Testing and Quality Assurance

To uphold high reliability and performance standards, I authored a suite of unit tests for critical screens, including:

- User Profile Screen
- Song Quiz Screen
- Most Listened/Shared Nearby screens

These tests ensured that:

- Components render correctly
- Data fetching works as intended
- User interactions—such as following/unfollowing another user or participating in a quiz—operate without issues



### Project Management and Documentation

Beyond coding, I contributed to the project’s management tasks by:

- Helping organize the final presentation
- Preparing testing strategies for mobile team in lab report.
- Planning the user journey for our demonstration
- Ensuring that both mobile and web experiences complemented each other
- Documenting critical decisions and action items by taking thorough meeting notes
- Preparing final milestone report



### Code-Related Significant Issues

- **[Mobile]: [Following Posts](https://github.com/bounswe/bounswe2024group3/issues/594)** 
Get the following posts on the feed.
- **[Mobile]: [Most Listened/Shared Nearby Tests](https://github.com/bounswe/bounswe2024group3/issues/586)**  
Implement Unit Tests for Most Listened/Shared Nearby Tests

- **[Mobile]: [Song Quiz Screen Test](https://github.com/bounswe/bounswe2024group3/issues/585)**  
  Implementation of Song Quiz Screen Tests

- **[Mobile]: [User Profile Screen Test](https://github.com/bounswe/bounswe2024group3/issues/584)**  
  Unit Tests for User Profile Screen

- **[Mobile]: [Async Storage for Username](https://github.com/bounswe/bounswe2024group3/issues/578)**  
  By including the username in the userData object during the login process and ensuring that it's correctly stored in AsyncStorage, profile.tsx screen should now be able to fetch and display the user's posts seamlessly.

- **[Mobile]: [Profile user posts section](https://github.com/bounswe/bounswe2024group3/issues/577)**  
  Get user posts on the user profile screen.

- **[Mobile]: [Get User Posts](https://github.com/bounswe/bounswe2024group3/issues/574)**  
  Get user posts on the user's screen.

- **[Mobile]: [User Profile](https://github.com/bounswe/bounswe2024group3/issues/572)**  
  User profile screen from the posts. It is created by dynamic routes.

- **[Mobile]: [Update on Like Dislike Functionality](https://github.com/bounswe/bounswe2024group3/issues/567)**  
  Update on like-dislike functionality.

- **[Mobile]: [Screen for Most Listened and Shared](https://github.com/bounswe/bounswe2024group3/issues/555)**  
  Implement a screen for both the most listened and the most shared. With buttons, the user can navigate the screen and see the most listened or shared thing nearby.
  
- **[Mobile]: [Most Shared Nearby](https://github.com/bounswe/bounswe2024group3/issues/554)**  
  Most shared nearby implementation on mobile.

- **[Mobile]: [Test screen for the quiz.](https://github.com/bounswe/bounswe2024group3/issues/545)**  
  Creating a test screen. Number of quizzes in the test asked from the user. Users will get some scores from the answers to the quiz.
  
- **[Mobile]: [Song lyrics quiz](https://github.com/bounswe/bounswe2024group3/issues/544)**  
  Song lyrics quiz implementation on mobile..
  
- **[Mobile]: [Create Post Modal Component](https://github.com/bounswe/bounswe2024group3/issues/531)**  
  Implemented create post modal component on mobile for creating posts.
  
- **[Mobile]: [Create Float Button Component ](https://github.com/bounswe/bounswe2024group3/issues/530)**  
  Implemented float button component on mobile for creating posts.
  
- **[Mobile]: [Connect most listened nearby to backend](https://github.com/bounswe/bounswe2024group3/issues/529)**  
  Connect most listened nearby to backend on mobile.
  
- **[Mobile]: [Most Listened Nearby Screen ](https://github.com/bounswe/bounswe2024group3/issues/528)**  
  Implementation of a new screen for most listened nearby functionality on mobile.

### Management-Related Significant Issues

- **[Mobile]: [Build the APK](https://github.com/bounswe/bounswe2024group3/issues/611)**
We need to build the APK of our app and need to add it to the release

- **[Deliverable]: [Testing Strategies](https://github.com/bounswe/bounswe2024group3/issues/494)** 
Testing strategies for the mobile team. (e.g. unit test coverage, integration testing, tools).

- **[Planning]: [Final presentation](https://github.com/bounswe/bounswe2024group3/issues/509)**
We should have a clear plan for the final presentation, including the user journey through the demo, the features we will show, and the outline of the presentation. We will try to have a scenario where we intertwine the web and mobile interfaces, not doing the same thing on both interfaces but showing how they complement each other.
- **[Deliverable]: [Milestone 3 Report](https://github.com/bounswe/bounswe2024group3/issues/614)**
We need to create the milestone 3 report
- **[Report]: [Taking Meeting Notes of the Lab (10.12.2024)](https://github.com/bounswe/bounswe2024group3/issues/618)**
Take the meeting notes of the Lab meeting.
- **[Report]: [Taking Meeting Notes of the Lab](https://github.com/bounswe/bounswe2024group3/issues/495)**
Take the meeting notes of the Lab meeting.
---

## Pull Requests

#### Created
- [Create post functionality](https://github.com/bounswe/bounswe2024group3/pull/503)  
- [Lyrics quiz feature](https://github.com/bounswe/bounswe2024group3/pull/546)  
- [Show lyrics button](https://github.com/bounswe/bounswe2024group3/pull/548)  
- [Most shared nearby feature](https://github.com/bounswe/bounswe2024group3/pull/557)  
- [Like/dislike connection](https://github.com/bounswe/bounswe2024group3/pull/568)  
- [Get user posts](https://github.com/bounswe/bounswe2024group3/pull/575)  
- [Include username during login](https://github.com/bounswe/bounswe2024group3/pull/582)  
- [Follow/unfollow functionality](https://github.com/bounswe/bounswe2024group3/pull/583)  
- [Get following posts](https://github.com/bounswe/bounswe2024group3/pull/595)  
- [Profile screen unit tests](https://github.com/bounswe/bounswe2024group3/pull/587)  
- [Unit tests for Most Listened/Shared Nearby screens](https://github.com/bounswe/bounswe2024group3/pull/588)  
- [Unit tests for Song Quiz screen](https://github.com/bounswe/bounswe2024group3/pull/589)  

#### Reviewed
- [Updated tests for mobile pages](https://github.com/bounswe/bounswe2024group3/pull/608)  
- [Fixed incorrect post titles](https://github.com/bounswe/bounswe2024group3/pull/597)  
- [Added back button to profile pages](https://github.com/bounswe/bounswe2024group3/pull/596)  
- [Implemented song suggestions and descriptions](https://github.com/bounswe/bounswe2024group3/pull/581)  
- [Fixed search page to fit updated endpoint](https://github.com/bounswe/bounswe2024group3/pull/571)  
- [Created main README and cleaned up repo](https://github.com/bounswe/bounswe2024group3/pull/558)  
- [Modified environment variable access](https://github.com/bounswe/bounswe2024group3/pull/502)

#### Merged
- [Updated tests for mobile pages](https://github.com/bounswe/bounswe2024group3/pull/608)  
- [Fixed incorrect post titles](https://github.com/bounswe/bounswe2024group3/pull/597)  
- [Added back button to profile pages](https://github.com/bounswe/bounswe2024group3/pull/596)  
- [Implemented song suggestions and descriptions](https://github.com/bounswe/bounswe2024group3/pull/581)  
- [Fixed search page to fit updated endpoint](https://github.com/bounswe/bounswe2024group3/pull/571)  
- [Created main README and cleaned up repo](https://github.com/bounswe/bounswe2024group3/pull/558)  
- [Modified environment variable access](https://github.com/bounswe/bounswe2024group3/pull/502)
---

## Unit Tests

### File: `UserProfileScreen.test.tsx`

#### Tests for Data Fetching and Display

- **Loading Indicators**: Checked that loading indicators appear initially while the user data and posts are being fetched.
- **User Data Fetch Failure**: Validated that if the user data fetch fails or returns null, the screen shows "No user data found."
- **Successful Data Fetch**: Confirmed that when user data and posts are fetched successfully, the user’s information (name, username, email, labels) and their posts are displayed correctly.
- **No Posts Scenario**: Verified that if there are no posts for the user, the message "This user hasn't posted anything yet." appears.

#### Tests for Following/Unfollowing Behavior

- **Follow Button Rendering**: Ensured that if the current user is not the profile owner, a Follow or Unfollow button is rendered according to the check-following endpoint result.
- **Follow Request**: Verified that pressing "Follow" sends a follow request.
- **Unfollow Request**: Verified that pressing "Unfollow" sends an unfollow request.
- **Own Profile**: Confirmed that no Follow/Unfollow button is shown if the current user is viewing their own profile.
- **Error Handling**: Validated that an error alert appears if the follow/unfollow request fails.

### File: `SongQuizScreen.test.tsx`

#### Tests for Quiz Initialization and Navigation

- **Initial View**: Confirmed that the initial view shows the quiz length selection screen.
- **Quiz Length Selection**: Ensured that selecting a quiz length triggers an API call and displays the first quiz question with multiple answer options.
- **Loading and Failure States**: Tested that a loading indicator or appropriate messages appear during data fetches and on failures.

#### Tests for Answering Questions

- **Correct Answer**: Checked that selecting the correct answer updates the points and reveals the "Next Question" or "See Results" button.
- **Incorrect Answer**: Validated that selecting the incorrect answer does not increase points but still allows the user to move to the next step.

#### Tests for Quiz Completion and Restarting

- **Results Screen**: Confirmed that after completing the chosen number of questions, the results screen displays the final score.
- **Restart Quiz**: Ensured that pressing "Restart Quiz" resets the quiz back to the length selection screen.

#### Tests for Error Handling

- **Quiz Data Fetch Failure**: Verified that an error message is shown if fetching quiz data fails.

### File: `MostListenedNearby.test.tsx`

#### Tests for Data Fetching and Display

- **Initial Loading Indicator**: Confirmed that a loading indicator is shown initially.
- **Most Listened Data Success**: Validated that when fetching "Most Listened" data succeeds, the returned tracks appear in the list.
- **Switching to Most Shared**: Ensured that switching tabs to "Most Shared" triggers the appropriate API call and displays the fetched songs and their details.
- **API Call Failure**: Checked that an error message is displayed when the API call fails.
- **No Data Scenario**: Confirmed that if no data is returned, a "No tracks found nearby." message is displayed.

#### Tests for Refreshing Data

- **Pull to Refresh**: Verified that pulling to refresh triggers a re-fetch of data and updates the displayed list accordingly.



### `index.test.tsx` (Milestone II)

#### Tests for Initial Rendering and UI
- **Theme Toggle Icon Display:** Confirmed that the theme toggle icon (initially `moon-outline`) is displayed on the first render.
- **Posts Rendering:** Verified that all posts from `mockPosts` are rendered by checking their titles in the rendered output.

#### Tests for Theme Toggling Behavior
- **Icon Toggle Functionality:** Ensured that pressing the theme button switches the icon from `moon-outline` to `sunny-outline`, effectively confirming the theme toggle functionality.

#### Tests for Post Card Rendering
- **PostCard Components:** Validated that `PostCard` components are rendered with the correct post titles derived from `mockPosts`.

---

### `recommendations.test.tsx` (Milestone II)

#### Tests for Initial Data Display
- **Random Posts Rendering:** Confirmed that on initial mount, exactly 3 random posts are rendered from the `mockPosts` pool.

#### Tests for Theme Toggling Behavior
- **Initial Theme Icon:** Checked that the theme icon starts as `moon-outline`.
- **Theme Toggle Action:** Verified that pressing the icon toggles it to `sunny-outline`.

#### Tests for Data Refreshing
- **Refresh Functionality:** Verified that pressing the "refresh" button causes the component to fetch a new set of posts, ensuring that after the refresh action, 3 posts are still displayed.

### Additional
I regularly attended all the classes and labs to learn the reasons underlying the implementations we implemented and the things explained in the classes and labs. On the other hand, I actively participated in the preparation of the lab reports and kept all the meeting notes and actively communicated with my group mates to prepare action items on behalf of the group. Although I had no previous mobile development experience, I joined the mobile team to improve myself and took an active role in the development of our mobile app and implemented many features. I learned a lot about implementing them in accordance with the standards and developing their tests. In general, I can say that this course added a lot to me in terms of what was explained in the course, communication and responsibility within the group and mobile development.

## Member: Esad Yusuf Atik - Backend & DevOps
### Responsibilities
I was responsible for the backend and DevOps.

### Main Contributions
-
### Code-Related Significant Issues
- **[Deployment]: [Update env vars in deployment for better secret management](https://github.com/bounswe/bounswe2024group3/issues/590)**

### Management Related Significant Issues
- **[Backend]: [API Documentation](https://github.com/bounswe/bounswe2024group3/issues/493)**
- **[Backend]: [Update API documentation](https://github.com/bounswe/bounswe2024group3/issues/624)**
### Pull Requests 
#### Created
- **[Better prof env var management #591](https://github.com/bounswe/bounswe2024group3/pull/591)**
- **[Fix backend only Docker compose #592](https://github.com/bounswe/bounswe2024group3/pull/592)**

#### Reviewed
- **[[Backend]: Profile fields](https://github.com/bounswe/bounswe2024group3/pull/570)**
#### Merged
- 
### Unit Tests
- I didn't write unit test but I'm the one who tested the website manually after each deployment. I think this can be counted as an e2e test.

### Additional
I think our team did a very good job of defining features to implement, sharing tasks based on the same vision and actually finishing these tasks. I am normally very busy with my work so I might not have contributed as much as my partners. Nevertheless, I think our team was special and great to work with.


---

## Member: Yusuf Suat Polat


## Responsibilities
I was responsible for implementing backend functionalities for the project. My tasks included integrating external APIs, fixing bugs, and enhancing core backend functionality. 

---

## Main Contributions

### Code-Related Significant Issues
Below is a list of significant issues I contributed to and resolved:

- **[Backend]: [Implement Liked Songs From Spotify](https://github.com/bounswe/bounswe2024group3/issues/619)**  
  Implemented backend functionality for fetching recently liked songs from the connected Spotify account.

- **[Backend]: [Unit Tests for Recently Liked Songs](https://github.com/bounswe/bounswe2024group3/issues/620)**  
  Added tests for Spotify Recently Liked Songs feature to ensure seamless functionality.
  
- **[Backend]: [Edit Profile Functionality](https://github.com/bounswe/bounswe2024group3/issues/625)**  
  Implemented backend functionality for editing the profile fields.

- **[Backend]: [Unit Tests for Edit Profile](https://github.com/bounswe/bounswe2024group3/issues/626)**  
  Added tests for edit profile feature to ensure seamless functionality.

### Management-Related Significant Issues
- **Improved Team Collaboration:** Regularly coordinated with team members to align backend efforts, ensuring seamless integration.
- **Testing Coverage:** Enhanced testing coverage across backend components.

---

## Pull Requests
Below is a summary of my pull requests:

1. **[Profile Fields](https://github.com/bounswe/bounswe2024group3/pull/570)**  
   Implemented the profile fields including their edit functionality and unit tests.

2. **[Get liked songs](https://github.com/bounswe/bounswe2024group3/pull/560)**  
   The endpoint that returns the last liked songs by a user is implemented.


---

## Unit Tests
- **[Backend]: [Unit Tests for Edit Profile](https://github.com/bounswe/bounswe2024group3/issues/626)**  
  Added tests for edit profile feature to ensure seamless functionality.
- **[Backend]: [Unit Tests for Recently Liked Songs](https://github.com/bounswe/bounswe2024group3/issues/620)**  
  Added tests for Spotify Recently Liked Songs feature to ensure seamless functionality.

---

## Member: Jorge Velázquez Jiménez
### Responsibilities
- **Front-end development**: Worked on implementing user-facing features and ensuring a smooth and responsive interface.
- **Documentation and implementation of standards**: Documented and applied best practices, including WAI-ARIA standards, to improve accessibility and maintain consistency across the application.
- **Participation in discussions and decision-making**: Contributed to team discussions regarding key design and functional aspects of the application, influencing decisions to align with project goals.
- **Creation of unit tests for the front-end**: Wrote and maintained unit tests to ensure the stability and reliability of the front-end components.
### Main Contributions
- Created issues for web development to streamline task allocation and improve collaboration.
- Actively participated in group discussions and contributed to the overall project design.
- Researched relevant domain knowledge and technologies to recommend the best tools for the project.
- Authored the standards wiki page and related documentation to ensure clarity and alignment within the team.
- Developed the standards checklist for Lab 8 to maintain quality and adherence to established protocols.
### Code-Related Significant Issues
- [Verify the correct use of WAI-ARIA attributes](https://github.com/bounswe/bounswe2024group3/issues/505)
### Management Related Significant Issues
- [Write Standards checklist](https://github.com/bounswe/bounswe2024group3/issues/490)
- [Standards for Milestone 3 Report](https://github.com/bounswe/bounswe2024group3/issues/490)
### Pull Requests 
#### Created
- [Additions to complete standards](https://github.com/bounswe/bounswe2024group3/pull/508)
#### Reviewed
- [add map page](https://github.com/bounswe/bounswe2024group3/pull/551)
#### Merged
- [add map page](https://github.com/bounswe/bounswe2024group3/pull/551)- 
### Additional
- During this milestone, I was unable to contribute as much as I would have liked due to personal circumstances that required me to travel back to Spain. Unfortunately, this limited the time and effort I could dedicate to the project

---

## Member: Ahmet Burkay Kınık
### Responsibilities
Responsible for the design and implementation of the backend, writing data population scripts and the preparation of the milestone report

### Main Contributions
Changed the Content model, so that it holds the necessary information instead of just a raw json fetched from the Spotify API. This change was a big one and required a lot of thought.
Wrote functions to parse different responses from Spotify API.
Changed the post-creation endpoint’s implementation to accommodate the changes in the Content model.
Changed the search endpoint and implemented search for users.
Implemented Python scripts to register users and use save_now_playing after logging into each one to populate the data. User information was sensible and fetched from another source.
### Code-Related Significant Issues
- [Populate save now playing](https://github.com/bounswe/bounswe2024group3/issues/599)
- [Populate users](https://github.com/bounswe/bounswe2024group3/issues/598)
- [Add search functionality for users](https://github.com/bounswe/bounswe2024group3/issues/552)
- [Remove query parameters of the Spotify links](https://github.com/bounswe/bounswe2024group3/issues/507)
- [Parse the json in Content model](https://github.com/bounswe/bounswe2024group3/issues/504)

### Management Related Significant Issues
- [Write checklist for domain-specific features](https://github.com/bounswe/bounswe2024group3/issues/492)
- [Comprehensive Scenario for milestone report](https://github.com/bounswe/bounswe2024group3/issues/617)
- [Update API documentation](https://github.com/bounswe/bounswe2024group3/issues/624)
### Pull Requests 
#### Created
- [Burkay/create data population scripts](https://github.com/bounswe/bounswe2024group3/pull/610)
- [Added profiles to the results of search](https://github.com/bounswe/bounswe2024group3/pull/553)
- [Updated where search looks.](https://github.com/bounswe/bounswe2024group3/pull/549)
- [Burkay/parse content json](https://github.com/bounswe/bounswe2024group3/pull/510)

### Additional
- I have consulted wiut the new content type




## Project Artifacts

### Manuals
- **User Manual:** Instructions for using the system
- **System Manual:** System requirements and installation instructions (web and mobile), including Docker and emulator usage.
---
### User Manual

Welcome to the platform! This user manual provides a step-by-step guide on how to navigate and use the application based on the provided screenshots.

---

#### **1. Registration Page**
- **Location**: Accessible via the navbar.
- **Description**: On this page, new users can register by providing the required information (e.g., username, email, password). This is the first step to join the platform.

---

#### **2. Login Page**
- **Location**: Accessible via the navbar.
- **Description**: Existing users can log in using their credentials. This grants access to the full features of the platform.

---

#### **3. Feed Page**
- **Location**: Accessible after logging in.
- **Features**:
  - **Posts Feed**: Displays a feed of posts in the middle section.
  - **Most Listened Nearby**: Located on the right, this section highlights popular tracks being listened to nearby.
  - **Most Shared Nearby**: Found on the left, this section showcases the most shared content in your vicinity.
  - **Post Interaction**: Users can like or dislike any post.
  - **Theme Toggle**: A button on the navbar allows you to switch between dark and light themes. The dark theme view is shown in the fourth image.

---

#### **4. Post Page**
- **Location**: Accessed by clicking on a specific post in the feed.
- **Features**:
  - View detailed posts about tracks, artists, events, playlists, etc.
  - AI-generated descriptions and lyrics are provided for additional insights.
  - A list of **suggested songs** is displayed on the right.

---

#### **5. Post Creation**
- **Location**: Click the `+` button at the bottom-right corner of any page.
- **Description**: This page allows users to create a new post. Users can include text, images, or links to share their thoughts or content.

---

#### **6. Search Results**
- **Location**: Accessed by using the search bar on the navbar.
- **Features**:
  - Search results are displayed for tracks, artists, playlists, or other relevant content.

---

#### **7. Artist Search Results**
- **Location**: Part of the search functionality.
- **Description**: Displays search results specifically for artists, making it easy to explore music by your favorite or new artists.

---

#### **8. Profile Page**
- **Location**: Click on your profile picture in the navbar and select "Profile."
- **Features**:
  - View your profile details, including posts, playlists, and personal preferences.

---

#### **9. Connect Spotify Page**
- **Location**: Accessible from the feed page.
- **Description**: Users can connect their Spotify account to unlock additional features, such as personalized suggestions and playlist management.

---

#### **10. Spotify Playlists**
- **Location**: After connecting Spotify, accessible from the profile or relevant sections.
- **Description**: Displays all Spotify playlists linked to the user’s account.

---

#### **11. Playlist Details**
- **Location**: Click on any playlist from the "Spotify Playlists" page.
- **Features**:
  - View details of the selected playlist.
  - Add new tracks to the playlist.

---

#### **12. Adding Tracks**
- **Location**: Accessible via the "Playlist Details" page or directly from a post page.
- **Description**: Add tracks to a playlist with ease by using the respective add button.

---

#### **13. Fun Quiz**
- **Location**: Accessible from the navbar or a dedicated section.
- **Description**: Engage in a fun and interactive quiz designed to entertain and provide insights into your music preferences.

---

Enjoy exploring and interacting with the platform!



---

## Other Artifacts

### Software Requirements Specification (SRS)
- [Functional Requirements](https://github.com/bounswe/bounswe2024group3/wiki/Functional-Requirements)
- [Nonfunctional Requirements](https://github.com/bounswe/bounswe2024group3/wiki/Nonfunctional-Requirements)
- [Glossary](https://github.com/bounswe/bounswe2024group3/wiki/Glossary)

### Software Design Documents
- [Sequence Diagrams](https://github.com/bounswe/bounswe2024group3/wiki/Sequence-Diagrams)
- [Class Diagrams](https://github.com/bounswe/bounswe2024group3/wiki/Class-Diagrams)
- [Use Case Diagram](https://github.com/bounswe/bounswe2024group3/wiki/Use-Case-Diagram)

### User Scenarios and Mockups
- [Scenario and Mockup 1](https://github.com/bounswe/bounswe2024group3/wiki/Scenario-1-%E2%80%90-Content-Creation-for-a-Music)
- [Scenario and Mockup 2](https://github.com/bounswe/bounswe2024group3/wiki/Scenario-2%E2%80%90-Donation-to-the-Artist)
- [Scenario and Mockup 3](https://github.com/bounswe/bounswe2024group3/wiki/Scenerio-3)
- [Scenario and Mockup 4](https://github.com/bounswe/bounswe2024group3/wiki/Scenario-4-%E2%80%90-Follows-Artists-and-Users-to-Enhance-the-Music-Experience)
- [Scenario and Mockup 5](https://github.com/bounswe/bounswe2024group3/wiki/Scenario-5-%E2%80%90-Content-Filtering-and-Interaction)

### Project Plan
- [GitHub Projects](https://github.com/orgs/bounswe/projects/61)

### Unit Tests
- Each group has written unit tests for the functionalities they have implemented.

### Software Package

#### [Final Release](https://github.com/bounswe/bounswe2024group3/releases/tag/customer-presentation-3)
- **Release Name:** 0.9.0
- **Release Description:** Group 3 CMPE 451 2024 Fall Final Release
- **Tag Name:** customer-presentation-3
- **Instructions:** 
To build and run the project using docker:

```
cd docker-compose
docker compose up --build
```
and navigate to [http://localhost:3000/](http://localhost:3000/)

For mobile:

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
- **Database Content:** Includes at least 100 realistic posts.
