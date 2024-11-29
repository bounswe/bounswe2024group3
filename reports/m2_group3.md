---
title: Milestone 2 Review

---

# Milestone 2 Review



## The requirements addressed in this milestone

### User Requirements

#### 1 User Registration and Authentication  
**1.1 Registration**  
- Users shall register for an account by providing necessary information, including name, username, email, and password.  
- Users shall choose their user categories.  

**1.2 Authentication**  
- Users shall log in to the system using their username and password.  
- Users shall be able to securely reset their passwords.  
- Users shall be able to log out.  

#### 3. Content Creation and Interaction  
**3.1 Post Creation**  
- Users shall be able to create and publish posts containing text, images, links, and embedded Spotify playlists.  
  - Users shall be able to create event posts.  
  - Users shall be able to create artist posts.  
  - Users shall be able to create song posts.  
  - Users shall be able to create playlist posts.  

#### 4. Music Management and Recommendations  
**4.1 Music and Artist Recommendations**  
- Users shall see music and artist recommendations based on the music or artist they are viewing.  

**4.2 Music Playback**  
- Users shall be able to play music directly through embedded Spotify players within the platform.  

#### 6. User and Artist Search  
**6.1 Search Functionality**  
- Users shall be able to search for artists and other users to connect with them.  

#### 7. Accessibility  
**7.1 Screen Reader Compatibility**  
- Users shall visually access and navigate all features independently with the platform being compatible with screen reading software.  


## System Requirements
### 1. User Registration and Authentication  
**1.1 Registration**  
- The system shall securely store user registration information, including name, username, email, and password.  
- The system shall allow users to select their user categories during registration.  

**1.2 Authentication**  
- The system shall authenticate users during login using their username and password.  
- The system shall provide a secure password reset functionality.  
- The system shall allow users to log out securely.  

### 3. Content Creation and Interaction  
**3.1 Post Creation**  
- The system shall support the creation and publication of posts containing text, images, links, and embedded Spotify playlists.  
  - The system shall allow the creation of event posts.  
  - The system shall allow the creation of artist posts.  
  - The system shall allow the creation of song posts.  
  - The system shall allow the creation of playlist posts.  

**3.2 Post Interaction**  
- The system shall enable users to bookmark, like/dislike, and comment on posts.  

**3.3 Event Sharing**  
- The system shall provide functionality for users to share concert or similar event details in their posts.  

### 4. Music Management and Recommendations  
**4.1 Music and Artist Recommendations**  
- The system shall provide music and artist recommendations based on user preferences and the content being viewed.  

**4.2 Music Playback**  
- The system shall embed Spotify players to allow users to play music directly within the platform.  

### 6. Playlist Sharing  
**6.1 Playlist Creation and Sharing**  
- The system shall allow users to create and share playlists with other users.  

**6.2 Embedded Playlists**  
- The system shall support embedding playlists into posts for easy sharing.  

### 7. Event Sharing  
**7.1 Concert Post Sharing**  
- The system shall enable users to share concert-related posts with event details.  

## Deliverables
### List and status of deliverables. Provide progress according to requirements: being either not started, in progress, or completed (completed means all of the following: the feature is implemented, tested, documented, and deployed).

### UX design with focus on domain-specific nature of the features.


### Description of the Standard Being Utilized (with Examples)

**Standard**: WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications)  
**Purpose**: The WAI-ARIA standard is used to improve the accessibility of web applications, particularly for users who rely on assistive technologies such as screen readers. It provides additional descriptive information that helps convey the purpose and behavior of user interface elements, ensuring the application is accessible to a broader audience.

#### Example from the Project: Login Page
The `LoginPage` component utilizes multiple WAI-ARIA attributes to enhance accessibility, ensuring that all elements are accessible and easily understandable by screen readers. This is particularly useful for users who rely on screen readers, such as individuals who are blind or visually impaired.

```jsx
<form className="flex flex-col gap-4 p-4" onSubmit={handleLogin}>
  <FormInput
    icon="user"
    type="user"
    placeholder="username"
    value={username}
    onChange={(e: any) => setUsername(e.target.value)}
    aria-label="Username"
  />
  <FormInput
    icon="password"
    type="password"
    placeholder="password"
    value={password}
    onChange={(e: any) => setPassword(e.target.value)}
    aria-label="Password"
  />
  <button type="submit" className="btn btn-primary mt-4" aria-label="Submit">
    Login
  </button>
  <button
    type="button"
    className="btn btn-secondary mt-4"
    onClick={navigateToResetRequest}
    aria-label="Forgot Password?"
  >
    Forgot Password?
  </button>

  {error && <p className="text-red-500">{error}</p>}
</form>
```

#### WAI-ARIA Usage in the Component
1. **aria-label Attribute**:
   - The `aria-label` attribute is used to provide descriptive labels for form elements and buttons. This helps users who rely on screen readers understand the purpose of each element.

   - **Username Input**:
     ```jsx
     <FormInput
       icon="user"
       type="user"
       placeholder="username"
       value={username}
       onChange={(e: any) => setUsername(e.target.value)}
       aria-label="Username"
     />
     ```
     The `aria-label="Username"` helps screen readers identify the purpose of the input field, providing a clear and concise description for users.

   - **Password Input**:
     ```jsx
     <FormInput
       icon="password"
       type="password"
       placeholder="password"
       value={password}
       onChange={(e: any) => setPassword(e.target.value)}
       aria-label="Password"
     />
     ```
     The `aria-label="Password"` ensures that users understand this field is for entering their password.

   - **Submit and Forgot Password Buttons**:
     ```jsx
     <button type="submit" className="btn btn-primary mt-4" aria-label="Submit">
       Login
     </button>
     <button
       type="button"
       className="btn btn-secondary mt-4"
       onClick={navigateToResetRequest}
       aria-label="Forgot Password?"
     >
       Forgot Password?
     </button>
     ```
     The `aria-label="Submit"` and `aria-label="Forgot Password?"` provide descriptive labels for buttons, making it clear to users what each button does.

#### Impact on Accessibility
By using **WAI-ARIA labels** in this component, we ensure that users who rely on assistive technologies have a seamless experience interacting with the form. The labels provide important contextual information that improves the understanding of form fields and buttons, making the login process accessible to all users, including those who are blind or visually impaired.

 
### API documentation (with examples).

## Testing

### The general test plan for the project, which describes your product's testing strategy(e.g. unit testing, integration testing, mock data).
We have implemented and will continue to maintain comprehensive unit testing for our application. Additionally, we will conduct extensive user testing on both web and mobile platforms. Since most of our friends use Spotify, we plan to invite friends to try out the application to gather feedback. We will incentivize participation with motivator chocolate bars.


### Generated unit test reports (for back-end, front-end, and mobile).
#### Back-end
We have implemented unit tests for our endpoints in the backend. We needed to check if we were able to leverage Spotify API as we planned. This included refreshing the access token, fetching the content when necessary. Moreover, we needed to test if our endpoints work as expected while we create posts, serve posts, features like playing nearby, like/dislike a post.
#### Front-end
We have implemented comprehensive unit tests for our helper functions on the front-end to ensure their reliability and correctness across various scenarios. These tests help validate the functionality of critical utilities used throughout the application, minimizing the likelihood of unexpected behavior.

In addition to the helper functions, we have developed a dedicated test for the "Create Post" modal. This test verifies that the modal behaves as expected, including rendering correctly, handling user input, and successfully triggering post-creation actions. 


#### Mobile
We created tests for every page we implemented or modified during this milestone. We had some difficulties while importing certain components but we were able to solve them by importing mock components. Currently we are able to pass our tests.

## Planning and Team Process

### Describe any changes your team has made since Milestone 1 or planned for the future to improve the development process. Explain how these changes impacted or will impact your process.

### Plan for completing your project.

### Link to a detailed project plan in your wiki or repository. If you're using Project Libre, either commit your plan file to your repository or document screenshots of the plan in your wiki, linking either way in this section. On the other hand, if you're using GitHub Projects, take screenshots of the board and document them in your wiki, linking in this section.
https://github.com/orgs/bounswe/projects/61/views/1


## Describe any changes your team has made since Milestone 1 or planned for the future to improve the development process. Explain how these changes impacted or will impact your process.

Since Milestone 1, our team has implemented several changes to enhance the development process and align with feedback. Based on the teacher's suggestion to make the app more domain-specific, we added a feature that allows posts to include domain-specific tags, fostering a focused and relevant user experience. Additionally, we aim to make the app more community-driven by incorporating features that encourage user interaction and engagement. To ensure smooth progress, we are prioritizing tracking issues effectively and have improved our issue management process. Moving forward, our focus remains on fully implementing all project requirements to deliver a comprehensive solution.

## Evaluation
### A summary of the customer feedback and reflections.
The primary feedback from the customer centered on the features we implemented and how they can be improved.The amount of features we implemented was not satisfactory. We were advised to implement more features properly. This feedback suggests a need to refine our project direction to better align with customer expectations.
### Evaluation of the status of deliverables and their impact on your project plan (reflection).
We’ve implemented some features, including creating posts, liking/disliking posts, listened nearby songs. Our aim in this milestone was to implement more specific features to improve the focus on our domain, which has led us to revisit certain requirements in response to customer feedback from the first milestone and create/implement new features. We will pay more attention to the feedbacks that we got for MS1 and MS2 and will focus on implementing more domain-focused features properly. This focus will guide us in refining the scope and adjusting our project plan accordingly.
### Evaluation of tools and processes you have used to manage your team project.
- We used WhatsApp as the communication platform. It was pretty useful to keep in touch both from mobile and computer.

- We used Github as VMS, as expected. Especially the tracking issues were helpful to track the progress.

- We used Expo to develop and manage the native mobile app. Its live preview feature was particularly beneficial for quickly observing and testing changes without the need to repeatedly build APKs or install updates. This streamlined the development process and significantly reduced iteration times.


# Individual Contributions

## Member: (You can use as a template)
### Responsibilities

### Main Contributions
-
### API Contributions
#### Example call and response
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
### Additional
- 

## Member: Abdullah Enes Güleş
### Responsibilities
I was responsible for brainstorming ideas and deciding on our project features with all my other group members and developing the mobile application with Enes.

### Main Contributions
- I created issues for our mobile development roadmap.
- I actively participated in group discussions and project design.
- I researched the domain and the technologies that we can use to develop our project.
- I researched the best practices of using environment variables with react-native.
- I have connected our mock login and register pages with our back-end.
- I have implemented a functional search bar which displays songs and related information to those songs.
- I have implemented a functional profile page that shows user information related to the user.
- I have connected our feed which had mock posts to our back-end with Enes.
- I have connected our recommendations page to our back-end with Enes.
- I initialized the milestone report structure.
- Contributed to the release of our project by providing commands to run the mobile app.
- Created unit tests for every page I implemented.
### API Contributions
I worked as a mobile developer so I didn't create an endpoint. 
The most complex endpoint that I have used was the search endpoint. This endpoint is the cornerstone of the Search Screen. Here is why it is complex:
	•	The API handles flexible search inputs and filters content based on multiple fields.
	•	Requires calculating page ranges manually to return the appropriate subset of results.
	•	The description field is a string that contains deeply nested JSON strings as well, which required us to use regex parsing.
	•	On the frontend, regex is used to extract image URLs and metadata dynamically, adding complexity to the rendering logic.

This endpoint is used in the context of a user searching for a song or an artist that was posted in the forum before.
We extract image URLs, metadata like album release date, etc. to display to the user. 

#### Example call and response
`GET /api/search/?search=sophie&page=1&page_size=5`
```json
{
  "total_results": 1,
  "page": 1,
  "page_size": 5,
  "contents": [
    {
      "id": 1,
      "content_type": "track",
      "description": "[{"content_type": "track", "description": "{'album': {'album_type': 'album', 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu'}, 'href': 'https://api.spotify.com/v1/artists/5a2w2tgpLwv26BYJf2qYwu', 'id': '5a2w2tgpLwv26BYJf2qYwu', 'name': 'SOPHIE', 'type': 'artist', 'uri': 'spotify:artist:5a2w2tgpLwv26BYJf2qYwu'}], 'available_markets': [], 'external_urls': {'spotify': 'https://open.spotify.com/album/6ukR0pBrFXIXdQgLWAhK7J'}, 'href': 'https://api.spotify.com/v1/albums/6ukR0pBrFXIXdQgLWAhK7J', 'id': '6ukR0pBrFXIXdQgLWAhK7J', 'images': [{'url': 'https://i.scdn.co/image/ab67616d0000b2736b03d8c63599cc94263d7d60', 'width': 640, 'height': 640}, {'url': 'https://i.scdn.co/image/ab67616d00001e026b03d8c63599cc94263d7d60', 'width': 300, 'height': 300}, {'url': 'https://i.scdn.co/image/ab67616d000048516b03d8c63599cc94263d7d60', 'width': 64, 'height': 64}], 'name': \"OIL OF EVERY PEARL'S UN-INSIDES\", 'release_date': '2018-06-15', 'release_date_precision': 'day', 'total_tracks': 9, 'type': 'album', 'uri': 'spotify:album:6ukR0pBrFXIXdQgLWAhK7J'}, 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu'}, 'href': 'https://api.spotify.com/v1/artists/5a2w2tgpLwv26BYJf2qYwu', 'id': '5a2w2tgpLwv26BYJf2qYwu', 'name': 'SOPHIE', 'type': 'artist', 'uri': 'spotify:artist:5a2w2tgpLwv26BYJf2qYwu'}], 'available_markets': [], 'disc_number': 1, 'duration_ms': 232806, 'explicit': False, 'external_ids': {'isrc': 'AUFF01800039'}, 'external_urls': {'spotify': 'https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas'}, 'href': 'https://api.spotify.com/v1/tracks/5nTtCOCds6I0PHMNtqelas', 'id': '5nTtCOCds6I0PHMNtqelas', 'is_local': False, 'name': 'Immaterial', 'popularity': 0, 'preview_url': 'https://p.scdn.co/mp3-preview/2ed3e81fe7b79aca5ac655d89412d8ecb968423f?cid=c62a7c9ab8724af590583cf994eb285a', 'track_number': 8, 'type': 'track', 'uri': 'spotify:track:5nTtCOCds6I0PHMNtqelas'}", "id": 1, "link": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas"}]",
      "link": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas"
    }
  ]
}
```

### Code-Related Significant Issues
- [Connect login and register to backend](https://github.com/bounswe/bounswe2024group3/issues/459)
- [Searchbar](https://github.com/bounswe/bounswe2024group3/issues/417)
- [Profile page](https://github.com/bounswe/bounswe2024group3/issues/413)
- [Unit tests for screens](https://github.com/bounswe/bounswe2024group3/issues/470)
### Management Related Significant Issues
- [Plan the demo](https://github.com/bounswe/bounswe2024group3/issues/388)
- [Milestone report preperation](https://github.com/bounswe/bounswe2024group3/issues/478)
- [Contributed to Mobile Tracking Issue](https://github.com/bounswe/bounswe2024group3/issues/418)
- [Contributed to Milestone 2 Tracking issue](https://github.com/bounswe/bounswe2024group3/issues/371)
- [Discussion on the User Stories](https://github.com/bounswe/bounswe2024group3/issues/380)
- [Create a PR to link work done LAB 5](https://github.com/bounswe/bounswe2024group3/issues/372)
- [[General Question]: Decide on the standards ](https://github.com/bounswe/bounswe2024group3/issues/368)
### Pull Requests 
#### Created
- [Connect login and register to backend](https://github.com/bounswe/bounswe2024group3/pull/460)
- [Implement profile page with backend](https://github.com/bounswe/bounswe2024group3/pull/461)
- [Implement search page](https://github.com/bounswe/bounswe2024group3/pull/468)
- [Connected recommendations and fixed bug in search with Enes](https://github.com/bounswe/bounswe2024group3/pull/469)
- [Add missing unit tests for search](https://github.com/bounswe/bounswe2024group3/pull/471)
#### Reviewed
- [updated like dislike buttons](https://github.com/bounswe/bounswe2024group3/pull/465)
- [Unit tests for tabs](https://github.com/bounswe/bounswe2024group3/pull/464) 
- [Recommendations](https://github.com/bounswe/bounswe2024group3/pull/462) 
- [Change toggle theme button](https://github.com/bounswe/bounswe2024group3/pull/463)
- [Add a change thme button for UX](https://github.com/bounswe/bounswe2024group3/pull/387)
#### Merged
- [updated like dislike buttons](https://github.com/bounswe/bounswe2024group3/pull/465)
- [Unit tests for tabs](https://github.com/bounswe/bounswe2024group3/pull/464) 
- [Recommendations](https://github.com/bounswe/bounswe2024group3/pull/462) 
- [Change toggle theme button](https://github.com/bounswe/bounswe2024group3/pull/463)
- [Add a change thme button for UX](https://github.com/bounswe/bounswe2024group3/pull/387)
### Additional
Researched expo and it's functional use cases to use in our project.
Motivated my teammates throughout the process and tried to create an enjoyful environment where me and my friends can have fun.


## Member: Batuhan Solmaz
### Responsibilities
I was responsible for writing location-based functionalities in the backend. I took part in designing the app and brainstormed with my teammates to develop ideas and solutions.

### Main Contributions
- Implemented location-based features for posts, such as saving and retrieving "now playing near you" data.
- Added functionalities for nearby events, songs, and posts.
- Fixed migrations issues and enhanced the backend to support location-related operations.
- Brainstormed and find new features.

### API Contributions
- [Backend]: Follow/unfollow endpoints (#410)
- [Backend]: Serve now playing near you through endpoint (#409)
- [Backend]: Save now playing - location at backend (#408)
- [Backend]: Implement nearby events, songs, posts feature (#479)

### Example Call and Response
**Endpoint:** `GET /api/most-listened-nearby/`

**Request:**  
```text
http://127.0.0.1:8000/api/most-listened-nearby/?latitude=40.0&longitude=28.0&radius=100
```
```json
{
    "tracks": [
        {
            "link": "https://open.spotify.com/intl-tr/album/5MS3MvWHJ3lOZPLiMxzOU6",
            "description": "{'album_type': 'album', 'total_tracks': 16, 'available_markets': [...], 'name': 'Her Loss', 'release_date': '2022-11-04', 'artists': [{'name': 'Drake'}, {'name': '21 Savage'}]}",
            "count": 10
        },
        {
            "link": "https://open.spotify.com/track/6DCZcSspjsKoFjzjrWoCdn",
            "description": "{'track_name': 'Blinding Lights', 'artist': 'The Weeknd', 'release_date': '2019-11-29'}",
            "count": 25
        }
    ]
}
```

### Code-Related Significant Issues
- **[Backend]: [Save now playing - location at backend (#408)](https://github.com/bounswe/bounswe2024group3/issues/408)**  
  Save now playing - location at backend. Implemented a db save for currently listening songs.
- **[Backend]: [Serve now playing near you through endpoint (#409)](https://github.com/bounswe/bounswe2024group3/issues/409)**  
  Added logic for serving "now playing" data near the user's location.
- **[Backend]: [Implement nearby events, songs, posts feature (#479)]([link-to-issue-479](https://github.com/bounswe/bounswe2024group3/issues/479))**  
  Developed features to display nearby events, songs, and posts based on user location.



### Management Related Significant Issues
- **[Documentation]: [Write User Story 1 (#378)](https://github.com/bounswe/bounswe2024group3/issues/378))**  
  Wrote a user story.
 - **[Wiki]: [Change User Requirements according to the Chosen Standard (#373)](https://github.com/bounswe/bounswe2024group3/issues/373))**  
- **[Deliverable]: [Write milestone report (#478)](https://github.com/bounswe/bounswe2024group3/issues/478))**  
  

### Pull Requests 
#### Created
- **[Add location features functionality (#442)](https://github.com/bounswe/bounswe2024group3/pull/442)**  
  - Changed post model, added user and location features.
  - Added functionalities for saving and retrieving "most shared nearby things" and "most listened nearby."
  - Fixed migrations issues.  
  **Status:** Merged  
  **Closes:** #408, #409, #443  

#### Reviewed
- **[Added search functionality for contents (#453)](https://github.com/bounswe/bounswe2024group3/pull/453)**  
  - Reviewed and merged the search functionality for content descriptions.  
  **Closes:** #402  

#### Merged
- **[Implements like/dislike functionality (#440)](https://github.com/bounswe/bounswe2024group3/pull/441)**  
  
  **Closes:** #411, #412  

### Additional
- Documented user stories and provided insights into the application design and usage scenarios.  
- Enhanced collaboration through brainstorming sessions and mentoring teammates during backend feature implementation.



## Member: Onur Dilsiz
### Responsibilities
- I was responsible for the development of front-end part of the application. Mostly, I was in charge of the communication in the front-end team.
- Participated in discussions and decision-making processes regarding project standards, documentation, and user stories.  
- Conducted code reviews, and merges to ensure consistency and maintainability of the project.
- Wrote and executed unit tests to improve test coverage and reliability of the application.  

### Main Contributions
- Developed a **post creation page**,   
- Designed and added a **theme controller**, allowing users to use the application in dark or light mode. 
- Fixed critical bugs like the **location fetch page**. Furthermore, I have fixed some bugs on the back-end   
- Added a **search bar for posts**, enhancing the user experience by enabling easy navigation and content discovery.  
- Created and tested a **most-listened nearby bar feature**, increasing user engagement with locally relevant music recommendations.  
- Contributed to testing **Spotify URL parsing functionality** which is one of the key functions on the front-end.  

### API Contributions
I have add a filtering for the spotify link of a post on the backend. 
#### Example call and response
GET *http://localhost:8000/api/get-posts/?link=https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM*

```json
{"posts": [{"id": 10, "comment": "S\u00fcper\n", "image": "", "link": "https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM", "created_at": "2024-11-25T17:20:15.646539+00:00", "total_likes": 0, "total_dislikes": 0, "username": "asd", "content": {"id": 9, "link": "https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM", "description": "{'album': {'album_type': 'album', 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/50AOA3aPd6tc928KEYaljF'}, 'href': 'https://api.spotify.com/v1/artists/50AOA3aPd6tc928KEYaljF', 'id': '50AOA3aPd6tc928KEYaljF', 'name': 'Ya\u015far', 'type': 'artist', 'uri': 'spotify:artist:50AOA3aPd6tc928KEYaljF'}], 'available_markets': ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM', 'BS', 'BB', 'BZ', 'BT', 'BW', 'BF', 'CV', 'CW', 'DM', 'FJ', 'GM', 'GE', 'GD', 'GW', 'GY', 'HT', 'JM', 'KI', 'LS', 'LR', 'MW', 'MV', 'ML', 'MH', 'FM', 'NA', 'NR', 'NE', 'PW', 'PG', 'PR', 'WS', 'SM', 'ST', 'SN', 'SC', 'SL', 'SB', 'KN', 'LC', 'VC', 'SR', 'TL', 'TO', 'TT', 'TV', 'VU', 'AZ', 'BN', 'BI', 'KH', 'CM', 'TD', 'KM', 'GQ', 'SZ', 'GA', 'GN', 'KG', 'LA', 'MO', 'MR', 'MN', 'NP', 'RW', 'TG', 'UZ', 'ZW', 'BJ', 'MG', 'MU', 'MZ', 'AO', 'CI', 'DJ', 'ZM', 'CD', 'CG', 'IQ', 'LY', 'TJ', 'VE', 'ET', 'XK'], 'external_urls': {'spotify': 'https://open.spotify.com/album/07yiI9ScrZV7DXiObRz6Sp'}, 'href': 'https://api.spotify.com/v1/albums/07yiI9ScrZV7DXiObRz6Sp', 'id': '07yiI9ScrZV7DXiObRz6Sp', 'images': [{'url': 'https://i.scdn.co/image/ab67616d0000b273d6652ff2755bedbda0914b35', 'width': 640, 'height': 640}, {'url': 'https://i.scdn.co/image/ab67616d00001e02d6652ff2755bedbda0914b35', 'width': 300, 'height': 300}, {'url': 'https://i.scdn.co/image/ab67616d00004851d6652ff2755bedbda0914b35', 'width': 64, 'height': 64}], 'name': 'Divane', 'release_date': '1996', 'release_date_precision': 'year', 'total_tracks': 11, 'type': 'album', 'uri': 'spotify:album:07yiI9ScrZV7DXiObRz6Sp'}, 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/50AOA3aPd6tc928KEYaljF'}, 'href': 'https://api.spotify.com/v1/artists/50AOA3aPd6tc928KEYaljF', 'id': '50AOA3aPd6tc928KEYaljF', 'name': 'Ya\u015far', 'type': 'artist', 'uri': 'spotify:artist:50AOA3aPd6tc928KEYaljF'}], 'available_markets': ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM', 'BS', 'BB', 'BZ', 'BT', 'BW', 'BF', 'CV', 'CW', 'DM', 'FJ', 'GM', 'GE', 'GD', 'GW', 'GY', 'HT', 'JM', 'KI', 'LS', 'LR', 'MW', 'MV', 'ML', 'MH', 'FM', 'NA', 'NR', 'NE', 'PW', 'PG', 'PR', 'WS', 'SM', 'ST', 'SN', 'SC', 'SL', 'SB', 'KN', 'LC', 'VC', 'SR', 'TL', 'TO', 'TT', 'TV', 'VU', 'AZ', 'BN', 'BI', 'KH', 'CM', 'TD', 'KM', 'GQ', 'SZ', 'GA', 'GN', 'KG', 'LA', 'MO', 'MR', 'MN', 'NP', 'RW', 'TG', 'UZ', 'ZW', 'BJ', 'MG', 'MU', 'MZ', 'AO', 'CI', 'DJ', 'ZM', 'CD', 'CG', 'IQ', 'LY', 'TJ', 'VE', 'ET', 'XK'], 'disc_number': 1, 'duration_ms': 202120, 'explicit': False, 'external_ids': {'isrc': 'TR2240596106'}, 'external_urls': {'spotify': 'https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM'}, 'href': 'https://api.spotify.com/v1/tracks/7tbD2Rl5Rxs7836NFZBQxM', 'id': '7tbD2Rl5Rxs7836NFZBQxM', 'is_local': False, 'name': 'Birtanem - Night Club Mix', 'popularity': 63, 'preview_url': 'https://p.scdn.co/mp3-preview/a80ac93cb8a26496a106dc592d909b09ffe00617?cid=c62a7c9ab8724af590583cf994eb285a', 'track_number': 6, 'type': 'track', 'uri': 'spotify:track:7tbD2Rl5Rxs7836NFZBQxM'}", "content_type": "track"}, "tags": []}, {"id": 11, "comment": "\u00e7ok iyi bi \u015fark\u0131\n", "image": "", "link": "https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM", "created_at": "2024-11-25T19:25:59.043555+00:00", "total_likes": 0, "total_dislikes": 0, "username": "asd", "content": {"id": 9, "link": "https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM", "description": "{'album': {'album_type': 'album', 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/50AOA3aPd6tc928KEYaljF'}, 'href': 'https://api.spotify.com/v1/artists/50AOA3aPd6tc928KEYaljF', 'id': '50AOA3aPd6tc928KEYaljF', 'name': 'Ya\u015far', 'type': 'artist', 'uri': 'spotify:artist:50AOA3aPd6tc928KEYaljF'}], 'available_markets': ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM', 'BS', 'BB', 'BZ', 'BT', 'BW', 'BF', 'CV', 'CW', 'DM', 'FJ', 'GM', 'GE', 'GD', 'GW', 'GY', 'HT', 'JM', 'KI', 'LS', 'LR', 'MW', 'MV', 'ML', 'MH', 'FM', 'NA', 'NR', 'NE', 'PW', 'PG', 'PR', 'WS', 'SM', 'ST', 'SN', 'SC', 'SL', 'SB', 'KN', 'LC', 'VC', 'SR', 'TL', 'TO', 'TT', 'TV', 'VU', 'AZ', 'BN', 'BI', 'KH', 'CM', 'TD', 'KM', 'GQ', 'SZ', 'GA', 'GN', 'KG', 'LA', 'MO', 'MR', 'MN', 'NP', 'RW', 'TG', 'UZ', 'ZW', 'BJ', 'MG', 'MU', 'MZ', 'AO', 'CI', 'DJ', 'ZM', 'CD', 'CG', 'IQ', 'LY', 'TJ', 'VE', 'ET', 'XK'], 'external_urls': {'spotify': 'https://open.spotify.com/album/07yiI9ScrZV7DXiObRz6Sp'}, 'href': 'https://api.spotify.com/v1/albums/07yiI9ScrZV7DXiObRz6Sp', 'id': '07yiI9ScrZV7DXiObRz6Sp', 'images': [{'url': 'https://i.scdn.co/image/ab67616d0000b273d6652ff2755bedbda0914b35', 'width': 640, 'height': 640}, {'url': 'https://i.scdn.co/image/ab67616d00001e02d6652ff2755bedbda0914b35', 'width': 300, 'height': 300}, {'url': 'https://i.scdn.co/image/ab67616d00004851d6652ff2755bedbda0914b35', 'width': 64, 'height': 64}], 'name': 'Divane', 'release_date': '1996', 'release_date_precision': 'year', 'total_tracks': 11, 'type': 'album', 'uri': 'spotify:album:07yiI9ScrZV7DXiObRz6Sp'}, 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/50AOA3aPd6tc928KEYaljF'}, 'href': 'https://api.spotify.com/v1/artists/50AOA3aPd6tc928KEYaljF', 'id': '50AOA3aPd6tc928KEYaljF', 'name': 'Ya\u015far', 'type': 'artist', 'uri': 'spotify:artist:50AOA3aPd6tc928KEYaljF'}], 'available_markets': ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM', 'BS', 'BB', 'BZ', 'BT', 'BW', 'BF', 'CV', 'CW', 'DM', 'FJ', 'GM', 'GE', 'GD', 'GW', 'GY', 'HT', 'JM', 'KI', 'LS', 'LR', 'MW', 'MV', 'ML', 'MH', 'FM', 'NA', 'NR', 'NE', 'PW', 'PG', 'PR', 'WS', 'SM', 'ST', 'SN', 'SC', 'SL', 'SB', 'KN', 'LC', 'VC', 'SR', 'TL', 'TO', 'TT', 'TV', 'VU', 'AZ', 'BN', 'BI', 'KH', 'CM', 'TD', 'KM', 'GQ', 'SZ', 'GA', 'GN', 'KG', 'LA', 'MO', 'MR', 'MN', 'NP', 'RW', 'TG', 'UZ', 'ZW', 'BJ', 'MG', 'MU', 'MZ', 'AO', 'CI', 'DJ', 'ZM', 'CD', 'CG', 'IQ', 'LY', 'TJ', 'VE', 'ET', 'XK'], 'disc_number': 1, 'duration_ms': 202120, 'explicit': False, 'external_ids': {'isrc': 'TR2240596106'}, 'external_urls': {'spotify': 'https://open.spotify.com/track/7tbD2Rl5Rxs7836NFZBQxM'}, 'href': 'https://api.spotify.com/v1/tracks/7tbD2Rl5Rxs7836NFZBQxM', 'id': '7tbD2Rl5Rxs7836NFZBQxM', 'is_local': False, 'name': 'Birtanem - Night Club Mix', 'popularity': 63, 'preview_url': 'https://p.scdn.co/mp3-preview/a80ac93cb8a26496a106dc592d909b09ffe00617?cid=c62a7c9ab8724af590583cf994eb285a', 'track_number': 6, 'type': 'track', 'uri': 'spotify:track:7tbD2Rl5Rxs7836NFZBQxM'}", "content_type": "track"}, "tags": []}]}
```

### Code-Related Significant Issues
- [[Web]: Post creation page](https://github.com/bounswe/bounswe2024group3/issues/389)
- [[Web]: Theme button is not working](https://github.com/bounswe/bounswe2024group3/issues/434) 
- [[Web]: Fix location fetch ](https://github.com/bounswe/bounswe2024group3/issues/444)
- [[Web]: Add tests for spotify url parses ](https://github.com/bounswe/bounswe2024group3/issues/447)
- [[Web]: Add a most listened nearby bar](https://github.com/bounswe/bounswe2024group3/issues/457)

### Management Related Significant Issues
- [[General Question]: Decide on the standards](https://github.com/bounswe/bounswe2024group3/issues/368)  
-  [[Documentation]: Discussion on the User Stories](https://github.com/bounswe/bounswe2024group3/issues/380)
-  [[Documentation]: Revise Nonfunctional Requirements](https://github.com/bounswe/bounswe2024group3/issues/370)
-  [[Deliverable]: Write milestone report](https://github.com/bounswe/bounswe2024group3/issues/478)
-  [[Wiki]: Write the test part for frontend in the ms report](https://github.com/bounswe/bounswe2024group3/issues/485)
-  [[Wiki]: Write the requirements covered in the ms report](https://github.com/bounswe/bounswe2024group3/issues/484)

### Pull Requests 
#### Created
- [add a theme controller](https://github.com/bounswe/bounswe2024group3/pull/381)
- [fix location fetch closes #444](https://github.com/bounswe/bounswe2024group3/pull/445) 
- [add search bar for posts](https://github.com/bounswe/bounswe2024group3/pull/436)
- [fix the wrong import](https://github.com/bounswe/bounswe2024group3/pull/449/)
- [add test for parsing spotify links](https://github.com/bounswe/bounswe2024group3/pull/450)
- [add post page ](https://github.com/bounswe/bounswe2024group3/pull/451)
- [Onur ekrem/like dislike](https://github.com/bounswe/bounswe2024group3/pull/454)
- [add most listened nearby bar](https://github.com/bounswe/bounswe2024group3/pull/458)
- [fix nan error](https://github.com/bounswe/bounswe2024group3/pull/467)



#### Reviewed and Merged
- [Fix context](https://github.com/bounswe/bounswe2024group3/pull/458) 
- [Add test for spotify link generator ](https://github.com/bounswe/bounswe2024group3/pull/456)
- [Add recommendations](https://github.com/bounswe/bounswe2024group3/pull/455) 
- [Fix post creating ui](https://github.com/bounswe/bounswe2024group3/pull/452) 
- [Add create post ](https://github.com/bounswe/bounswe2024group3/pull/446) 
- [Add jest as dev dependency and Add req test](https://github.com/bounswe/bounswe2024group3/pull/435) 
- [Fix context](https://github.com/bounswe/bounswe2024group3/pull/458) 
- [LocationFetcher](https://github.com/bounswe/bounswe2024group3/pull/384) 
- [Update PostCard.tsx to improve Like and Dislike buttons](https://github.com/bounswe/bounswe2024group3/pull/432) 
- [Addition of all aria-label ](https://github.com/bounswe/bounswe2024group3/pull/392)
- [Addition of follow/unfollow Button](https://github.com/bounswe/bounswe2024group3/pull/433)
- [let deployer choose https](https://github.com/bounswe/bounswe2024group3/pull/472)
- [fix nan bug](https://github.com/bounswe/bounswe2024group3/pull/466)
- [Create CreatePostForm.test.tsx](https://github.com/bounswe/bounswe2024group3/pull/482)
### Additional
Collaborated actively with Ekrem  in code reviews and bug fixes.

## Member: Yusuf Suat Polat
### Responsibilities
- I was responsible for brainstorming ideas and deciding on our project features with all my other group members and developing the backend with other team members.
- I was responsible for participating in discussions and decision-making processes regarding project standards, documentation, and user stories.
- I was responsible for code reviews, and merges to ensure consistency and maintainability of the project.
- I was responsible for group's communication with instructors.
- I was responsible for post structure of the app.
- I was responsible for tests of "save now playing" function.
- I was responsible for Spotify API integration.
### Main Contributions
- I implemented the "post" structure in behind.
- I implemented the create and get songs methods.
- I contributed brainstorming meetings, feature ideas.
- I implemented unit tests.
### API Contributions
- [Backend]: Post creation endpoint #395
- [Backend]: Post serving endpoint #480
#### Example call and response
POST http://localhost:8000/api/create-post/  
```json
Headers:  
Authorization: Bearer YOUR_ACCESS_TOKEN  
Content-Type: application/json  

Body:  
{  
    "link": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",  
    "image": "https://example.com/sample-image.jpg",  
    "comment": "Check out this amazing track!",  
    "latitude": 40.7128,  
    "longitude": -74.0060  
}  

Response (Success):  
201 Created  
{  
    "message": "Post created successfully",  
    "post": {  
        "id": 123,  
        "link": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",  
        "image": "https://example.com/sample-image.jpg",  
        "comment": "Check out this amazing track!",  
        "latitude": 40.7128,  
        "longitude": -74.0060,  
        "created_at": "2024-11-24T12:00:00Z",  
        "content": {  
            "id": 45,  
            "link": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",  
            "description": {  
                "name": "Track Name",  
                "artist": "Artist Name",  
                "album": "Album Name",  
                "release_date": "2023-01-01",  
                "spotify_url": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P"  
            },  
            "content_type": "track"  
        }  
    }  
}
```
GET http://localhost:8000/api/get-posts/?page=1&page_size=5&start_date=2024-01-01&end_date=2024-11-24  
```json
Headers:  
Authorization: Bearer YOUR_ACCESS_TOKEN  
Content-Type: application/json  

Response (Paginated Success):  
200 OK  
{  
    "posts": [  
        {  
            "id": 123,  
            "comment": "This is a great track!",  
            "image": "https://example.com/sample-image.jpg",  
            "link": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",  
            "created_at": "2024-11-24T12:00:00Z",  
            "total_likes": 50,  
            "total_dislikes": 3,  
            "username": "johndoe",  
            "content": {  
                "id": 45,  
                "link": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P",  
                "description": {  
                    "name": "Track Name",  
                    "artist": "Artist Name",  
                    "album": "Album Name",  
                    "release_date": "2023-01-01",  
                    "spotify_url": "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P"  
                },  
                "content_type": "track"  
            },  
            "tags": ["music", "spotify"]  
        },  
        {  
            "id": 124,  
            "comment": "Check this out!",  
            "image": "https://example.com/another-image.jpg",  
            "link": "https://open.spotify.com/track/5aAx2yezTd8zXrkmtKl66Z",  
            "created_at": "2024-11-23T15:00:00Z",  
            "total_likes": 20,  
            "total_dislikes": 1,  
            "username": "janedoe",  
            "content": {  
                "id": 46,  
                "link": "https://open.spotify.com/track/5aAx2yezTd8zXrkmtKl66Z",  
                "description": {  
                    "name": "Another Track Name",  
                    "artist": "Another Artist",  
                    "album": "Another Album Name",  
                    "release_date": "2023-05-01",  
                    "spotify_url": "https://open.spotify.com/track/5aAx2yezTd8zXrkmtKl66Z"  
                },  
                "content_type": "track"  
            },  
            "tags": ["pop", "music"]  
        }  
    ],  
    "pagination": {  
        "current_page": 1,  
        "total_pages": 10,  
        "total_posts": 50  
    }  
}
```
### Code-Related Significant Issues
- [Backend]: Post creation endpoint #395
- [Backend]: Post serving endpoint #480
### Management Related Significant Issues
- [Deliverable]: Milestone Report #478
### Pull Requests 
- Create post #437
- Save now playing tests implemented #477
#### Created
- Save now playing tests implemented #477
#### Reviewed
- Save now playing tests implemented #477
- Create post #437
#### Merged
- Create post #437
- Save now playing tests implemented #477

## Member: Esad Yusuf Atik
### Responsibilities
I was responsible for planning, implemenatation of some components of the backend, coordination between backend and frontend teams.

### Main Contributions
- Buying and setting up of our domain [spotonapp.win](https://spotonapp.win)

### API Contributions
I implemented the post like & dislike endpoints

#### Example call and response
**Call**
```
POST /api/posts/:id/like
```

**Response**
```json
{
  “status”: “success”,
  “message”: “Post liked”
}
```

### Code-Related Significant Issues
- [Like post endpoint #411](https://github.com/bounswe/bounswe2024group3/issues/411)
- [Dislike post endpoint #412](https://github.com/bounswe/bounswe2024group3/issues/412)

### Management Related Significant Issues
- [Milestone 2 Tracking Issue#371](https://github.com/bounswe/bounswe2024group3/issues/371#issuecomment-2485622884
 
### Pull Requests 
- [Remove .pyc files #438](https://github.com/bounswe/bounswe2024group3/pull/438)
- [Implement like dislike #441](https://github.com/bounswe/bounswe2024group3/pull/441)
- [Fix nan bug #466](https://github.com/bounswe/bounswe2024group3/pull/466)
- [Let deployer choose https #472](https://github.com/bounswe/bounswe2024group3/pull/472)
- [Fix prod host #473](https://github.com/bounswe/bounswe2024group3/pull/473)
- [Make docker db persistent #474](https://github.com/bounswe/bounswe2024group3/pull/474)


#### Created
- I created nearly all backend issues

#### Reviewed
- Same with merged 

#### Merged
- I merged some prs but it’s too hard to find them on GitHub
 
### Additional
- None


## Member: Enes Sait Besler
### Responsibilities
I developed mobile application together with Abdullah Enes and released a milestone-ready mobile application. At the same time, I actively contribute to the team in the lab by making decisions during meetings and taking meeting notes during the meeting.
I took active responsibility as each lab deliverable and wrote code if necessary, and wrote things that needed to be written about the wiki if necessary.

### Main Contributions


- I actively attended all labs and all lectures.
- In the lab, discussed and decided a standard for our team.
- I changed and updated user requirements to this chosen standard.
- Taking notes for that lab and deciding team with action item(with deadlines, details.)
- I wrote User Story 1 for this lab.
- Taking meeting notes for other lab, the lab and lecture was about UX in that week. 
- I made a UX change in mobile app and added a theme controller button.
- Created mobile development track issue and that was a roadmap for us.
- I started to implementations on mobile app. I started from scratch so I learnt so many things about mobile development.
- I implemented Like and Dislike buttons.
- I created Recommendation tab in mobile app.
- I created unit tests for my implementations.
- With Abdullah Enes connected our feed which had mock posts to our back-end with Enes.
- For milestone deliverables, I take the apk releaseof mobile app and uploaded it.
- Helped for creating milestone report.

### API Contributions
I made implementations on mobile app so I didn't create any endpoint.
I can say that search endpoint was so complex and I communicated and helped to Abdullah Enes to implementation of this endpoint. Also, he explained why this endpoint so
complex in this report. I will just show the example call and response from my Postman:
#### Example call and response
GET http://0.0.0.0:8000/api/search/  
```json


Response (Success):  
200 OK  
{
    "total_results": 1,
    "page": 1,
    "page_size": 10,
    "contents": [
        {
            "id": 1,
            "link": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas",
            "description": "{'album': {'album_type': 'album', 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu'}, 'href': 'https://api.spotify.com/v1/artists/5a2w2tgpLwv26BYJf2qYwu', 'id': '5a2w2tgpLwv26BYJf2qYwu', 'name': 'SOPHIE', 'type': 'artist', 'uri': 'spotify:artist:5a2w2tgpLwv26BYJf2qYwu'}], 'available_markets': [], 'external_urls': {'spotify': 'https://open.spotify.com/album/6ukR0pBrFXIXdQgLWAhK7J'}, 'href': 'https://api.spotify.com/v1/albums/6ukR0pBrFXIXdQgLWAhK7J', 'id': '6ukR0pBrFXIXdQgLWAhK7J', 'images': [{'url': 'https://i.scdn.co/image/ab67616d0000b2736b03d8c63599cc94263d7d60', 'width': 640, 'height': 640}, {'url': 'https://i.scdn.co/image/ab67616d00001e026b03d8c63599cc94263d7d60', 'width': 300, 'height': 300}, {'url': 'https://i.scdn.co/image/ab67616d000048516b03d8c63599cc94263d7d60', 'width': 64, 'height': 64}], 'name': \"OIL OF EVERY PEARL'S UN-INSIDES\", 'release_date': '2018-06-15', 'release_date_precision': 'day', 'total_tracks': 9, 'type': 'album', 'uri': 'spotify:album:6ukR0pBrFXIXdQgLWAhK7J'}, 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/5a2w2tgpLwv26BYJf2qYwu'}, 'href': 'https://api.spotify.com/v1/artists/5a2w2tgpLwv26BYJf2qYwu', 'id': '5a2w2tgpLwv26BYJf2qYwu', 'name': 'SOPHIE', 'type': 'artist', 'uri': 'spotify:artist:5a2w2tgpLwv26BYJf2qYwu'}], 'available_markets': [], 'disc_number': 1, 'duration_ms': 232806, 'explicit': False, 'external_ids': {'isrc': 'AUFF01800039'}, 'external_urls': {'spotify': 'https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas'}, 'href': 'https://api.spotify.com/v1/tracks/5nTtCOCds6I0PHMNtqelas', 'id': '5nTtCOCds6I0PHMNtqelas', 'is_local': False, 'name': 'Immaterial', 'popularity': 0, 'preview_url': 'https://p.scdn.co/mp3-preview/2ed3e81fe7b79aca5ac655d89412d8ecb968423f?cid=c62a7c9ab8724af590583cf994eb285a', 'track_number': 8, 'type': 'track', 'uri': 'spotify:track:5nTtCOCds6I0PHMNtqelas'}",
            "content_type": "track"
        }
    ]
}
```
I also worked on create-post endpoint when making implementations in mobile. I can give an example response from my Postman.

#### Example call and response
POST http://localhost:8000/api/create-post/  
```json
Headers:  
Authorization: Bearer YOUR_ACCESS_TOKEN  
Content-Type: application/json  

Body:  
{
  "link": "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas",
  "comment": "Check out this awesome track!"
} 

Response (Success):  
201 Created  
{
    "message": "Post created successfully",
    "post_id": 16
}
```
### Code-Related Significant Issues
- [[Mobile] Unit tests for screens](https://github.com/bounswe/bounswe2024group3/issues/470)
- [[Mobile]: Submenu for recommendations](https://github.com/bounswe/bounswe2024group3/issues/416)
- [[Mobile]: Like and dislike buttons](https://github.com/bounswe/bounswe2024group3/issues/415)
- [[Mobile]: Add a Theme Controller Button](https://github.com/bounswe/bounswe2024group3/issues/386)
### Non-Code Related Significant Issues
- [[Wiki]: Taking meeting notes](https://github.com/bounswe/bounswe2024group3/issues/385)
- [[Documentation]: Discussion on the User Stories ](https://github.com/bounswe/bounswe2024group3/issues/380)
- [[Documentation]: Write User Story 1](https://github.com/bounswe/bounswe2024group3/issues/378)
- [[Wiki]: Taking meeting notes](https://github.com/bounswe/bounswe2024group3/issues/374)
- [[Wiki]: Change User Requirements according to the Chosen Standard](https://github.com/bounswe/bounswe2024group3/issues/373)
- [[General Question]: Decide on the standards](https://github.com/bounswe/bounswe2024group3/issues/368)
### Pull Requests 
#### Created
- [Like dislike buttons](https://github.com/bounswe/bounswe2024group3/pull/465)
- [Unit tests for tabs](https://github.com/bounswe/bounswe2024group3/pull/464)
- [Change toggle theme button](https://github.com/bounswe/bounswe2024group3/pull/463)
- [Connected recommendations and fixed bug in search with Abdullah](https://github.com/bounswe/bounswe2024group3/pull/469)
- [Recommendations](https://github.com/bounswe/bounswe2024group3/pull/462)
- [Add a change theme button for UX.](https://github.com/bounswe/bounswe2024group3/pull/387)
#### Reviewed
- [Add unit tests for search](https://github.com/bounswe/bounswe2024group3/pull/471)
- [Recommendation and search](https://github.com/bounswe/bounswe2024group3/pull/469) 
- [Search](https://github.com/bounswe/bounswe2024group3/pull/468)  
- [Change toggle theme button](https://github.com/bounswe/bounswe2024group3/pull/463)
- [Connect profile](https://github.com/bounswe/bounswe2024group3/pull/461)
- [Connect login and register to backend](ttps://github.com/bounswe/bounswe2024group3/pull/460)
#### Merged
- [Add unit tests for search](https://github.com/bounswe/bounswe2024group3/pull/471)
- [Recommendation and search](https://github.com/bounswe/bounswe2024group3/pull/469)  
- [Search](https://github.com/bounswe/bounswe2024group3/pull/468) 
- [Change toggle theme button](https://github.com/bounswe/bounswe2024group3/pull/463)
- [Connect profile](https://github.com/bounswe/bounswe2024group3/pull/461)
- [Connect login and register to backend](ttps://github.com/bounswe/bounswe2024group3/pull/460)
### Additional
I maintained strong communication with the team to keep the team's energy high and to fulfill regular deliverables.
Although I had no previous mobile development experience, I learned mobile development from scratch and made many developments to meet its requirements.





## Member: Ahmet Burkay Kınık
### Responsibilities
I was resposible for the search feature in the backend, along with brainstorming ideas and making software design choices.

### Main Contributions
- I created the tracking issue of this milestone.
- I implemented the search functionality of the API.
- I wrote the tests for the search functionality.
- I contributed to the discussions of the UX features.
- I wrote the User Story 2.
- I researched the W3C standards and contributed to the choices.

### API Contributions
I worked in the backend team and I was responsible for the search functionality. 
- The endpoint handles search through multiple fields, such as artists, album names and song names.
- The endoint supports pagination and allows the endpoint's user to choose page size.

#### Example call and response
`GET /api/search/?search=duman&page=2&page_size=1`
```json
{
    "total_results": 2,
    "page": 2,
    "page_size": 1,
    "contents": [
        {
            "id": 2,
            "link": "https://open.spotify.com/track/2unEjH0rGblXt0GLNqG4gz?si=abb391fbcf3a4032",
            "description": "{'album': {'album_type': 'album', 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/6RTC1abMgBC7Krg6qJQHJh'}, 'href': 'https://api.spotify.com/v1/artists/6RTC1abMgBC7Krg6qJQHJh', 'id': '6RTC1abMgBC7Krg6qJQHJh', 'name': 'Duman', 'type': 'artist', 'uri': 'spotify:artist:6RTC1abMgBC7Krg6qJQHJh'}], 'available_markets': ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM', 'BS', 'BB', 'BZ', 'BT', 'BW', 'BF', 'CV', 'CW', 'DM', 'FJ', 'GM', 'GE', 'GD', 'GW', 'GY', 'HT', 'JM', 'KI', 'LS', 'LR', 'MW', 'MV', 'ML', 'MH', 'FM', 'NA', 'NR', 'NE', 'PW', 'PG', 'PR', 'WS', 'SM', 'ST', 'SN', 'SC', 'SL', 'SB', 'KN', 'LC', 'VC', 'SR', 'TL', 'TO', 'TT', 'TV', 'VU', 'AZ', 'BN', 'BI', 'KH', 'CM', 'TD', 'KM', 'GQ', 'SZ', 'GA', 'GN', 'KG', 'LA', 'MO', 'MR', 'MN', 'NP', 'RW', 'TG', 'UZ', 'ZW', 'BJ', 'MG', 'MU', 'MZ', 'AO', 'CI', 'DJ', 'ZM', 'CD', 'CG', 'IQ', 'LY', 'TJ', 'VE', 'ET', 'XK'], 'external_urls': {'spotify': 'https://open.spotify.com/album/6MrE8aTkCV6xuSnVCRJ1Wz'}, 'href': 'https://api.spotify.com/v1/albums/6MrE8aTkCV6xuSnVCRJ1Wz', 'id': '6MrE8aTkCV6xuSnVCRJ1Wz', 'images': [{'url': 'https://i.scdn.co/image/ab67616d0000b27304a14bda92ba327064436574', 'width': 640, 'height': 640}, {'url': 'https://i.scdn.co/image/ab67616d00001e0204a14bda92ba327064436574', 'width': 300, 'height': 300}, {'url': 'https://i.scdn.co/image/ab67616d0000485104a14bda92ba327064436574', 'width': 64, 'height': 64}], 'name': 'Darmaduman', 'release_date': '2013-09-12', 'release_date_precision': 'day', 'total_tracks': 13, 'type': 'album', 'uri': 'spotify:album:6MrE8aTkCV6xuSnVCRJ1Wz'}, 'artists': [{'external_urls': {'spotify': 'https://open.spotify.com/artist/6RTC1abMgBC7Krg6qJQHJh'}, 'href': 'https://api.spotify.com/v1/artists/6RTC1abMgBC7Krg6qJQHJh', 'id': '6RTC1abMgBC7Krg6qJQHJh', 'name': 'Duman', 'type': 'artist', 'uri': 'spotify:artist:6RTC1abMgBC7Krg6qJQHJh'}], 'available_markets': ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'CY', 'CZ', 'DK', 'DO', 'DE', 'EC', 'EE', 'SV', 'FI', 'FR', 'GR', 'GT', 'HN', 'HK', 'HU', 'IS', 'IE', 'IT', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NI', 'NO', 'PA', 'PY', 'PE', 'PH', 'PL', 'PT', 'SG', 'SK', 'ES', 'SE', 'CH', 'TW', 'TR', 'UY', 'US', 'GB', 'AD', 'LI', 'MC', 'ID', 'JP', 'TH', 'VN', 'RO', 'IL', 'ZA', 'SA', 'AE', 'BH', 'QA', 'OM', 'KW', 'EG', 'MA', 'DZ', 'TN', 'LB', 'JO', 'PS', 'IN', 'BY', 'KZ', 'MD', 'UA', 'AL', 'BA', 'HR', 'ME', 'MK', 'RS', 'SI', 'KR', 'BD', 'PK', 'LK', 'GH', 'KE', 'NG', 'TZ', 'UG', 'AG', 'AM', 'BS', 'BB', 'BZ', 'BT', 'BW', 'BF', 'CV', 'CW', 'DM', 'FJ', 'GM', 'GE', 'GD', 'GW', 'GY', 'HT', 'JM', 'KI', 'LS', 'LR', 'MW', 'MV', 'ML', 'MH', 'FM', 'NA', 'NR', 'NE', 'PW', 'PG', 'PR', 'WS', 'SM', 'ST', 'SN', 'SC', 'SL', 'SB', 'KN', 'LC', 'VC', 'SR', 'TL', 'TO', 'TT', 'TV', 'VU', 'AZ', 'BN', 'BI', 'KH', 'CM', 'TD', 'KM', 'GQ', 'SZ', 'GA', 'GN', 'KG', 'LA', 'MO', 'MR', 'MN', 'NP', 'RW', 'TG', 'UZ', 'ZW', 'BJ', 'MG', 'MU', 'MZ', 'AO', 'CI', 'DJ', 'ZM', 'CD', 'CG', 'IQ', 'LY', 'TJ', 'VE', 'ET', 'XK'], 'disc_number': 1, 'duration_ms': 264500, 'explicit': False, 'external_ids': {'isrc': 'TR0441312512'}, 'external_urls': {'spotify': 'https://open.spotify.com/track/2unEjH0rGblXt0GLNqG4gz'}, 'href': 'https://api.spotify.com/v1/tracks/2unEjH0rGblXt0GLNqG4gz', 'id': '2unEjH0rGblXt0GLNqG4gz', 'is_local': False, 'name': 'Melankoli', 'popularity': 51, 'preview_url': 'https://p.scdn.co/mp3-preview/d6d64e6e1b287acb5350eb9835daa14820a801a9?cid=c62a7c9ab8724af590583cf994eb285a', 'track_number': 12, 'type': 'track', 'uri': 'spotify:track:2unEjH0rGblXt0GLNqG4gz'}",
            "content_type": "track"
        }
    ]
}
```




### Code-Related Significant Issues
- [[Backend]: Search endpoint test](https://github.com/bounswe/bounswe2024group3/issues/419)
- [[Backend]: Search endpoint](https://github.com/bounswe/bounswe2024group3/issues/402)
### Management Related Significant Issues
- [[Documentation]: Discussion on the User Stories](https://github.com/bounswe/bounswe2024group3/issues/380)
- [[Documentation]: Write User Story 2](https://github.com/bounswe/bounswe2024group3/issues/379)
- [[General Question]: Decide on the standards](https://github.com/bounswe/bounswe2024group3/issues/368)
### Pull Requests 
#### Created
- [Added search functionality for contents](https://github.com/bounswe/bounswe2024group3/pull/453)
- [Wrote search endpoint tests](https://github.com/bounswe/bounswe2024group3/pull/476)

#### Reviewed
- [Create post](https://github.com/bounswe/bounswe2024group3/pull/437)
#### Merged
- [Wrote search endpoint tests](https://github.com/bounswe/bounswe2024group3/pull/476)
### Additional
I contributed significantly to the lab discussions and made sure we accomplished each lab's goals.

## Member: Jorge Velázquez Jiménez
### Responsibilities
- Created issues for web development and UX improvement.
- Participated in project and development decision-making, including UX design and standards selection.
- Developed unit tests to ensure code quality.
- Wrote front-end web code to implement features and functionality.
- Reviewed and merged pull requests (PRs).

### Main Contributions
- Developed the follow/unfollow button functionality.
- Researched an API and implemented a component to track user location.
- Selected and implemented the WAI-ARIA label standard to improve accessibility.
- Played a key role in defining UX standards and ensuring consistency across the project.
- Improved development efficiency by creating detailed and actionable issues.
- Contributed to the front-end implementation with high-quality code and tests.

### API Contributions
#### Example call and response
**Endpoint**: `GET https://api.opencagedata.com/geocode/v1/json`  
**Purpose**: Fetches the city name based on the user's geolocation coordinates (latitude and longitude).  
**Context/Scenario**: Used to track the user's location and display location-specific content in the application.

**Request**:
```json
GET /geocode/v1/json?q=41.0082+28.9784&key=YOUR_API_KEY
```

**Response**:
```json
{
  "results": [
    {
      "components": {
        "city": "Istanbul",
        "country": "Turkey"
      }
    }
  ]
}
```

**Usage in the project**:  
- The latitude and longitude values are first retrieved using the browser's Geolocation API and stored locally.  
- These coordinates are then sent to the OpenCageData API to fetch the city name.  
- The fetched city name is used to display content tailored to the user's location. For example, the application shows location-specific news, events, or recommendations based on the detected city.

### Code-Related Significant Issues
- [[Web]: Like and dislike buttons](https://github.com/bounswe/bounswe2024group3/issues/401)
- [[Web]: Follow/unfollow button](https://github.com/bounswe/bounswe2024group3/issues/400)
- [[Web]: User Experience improved](https://github.com/bounswe/bounswe2024group3/issues/430)

### Management-Related Significant Issues
- [[General Question]: Decide on the standards](https://github.com/bounswe/bounswe2024group3/issues/368)
- [[Deliverable]: Write milestone report](https://github.com/bounswe/bounswe2024group3/issues/478)
- [[Wiki]: Write Standard part in the ms report](https://github.com/bounswe/bounswe2024group3/issues/486)
- [[Documentation]: Discussion on the User Stories](https://github.com/bounswe/bounswe2024group3/issues/380)

### Pull Requests
#### Created
- [Accessibility for Web Standards](https://github.com/bounswe/bounswe2024group3/pull/375)
- [LocationFetcher](https://github.com/bounswe/bounswe2024group3/pull/384)
- [Addition of all aria-label](https://github.com/bounswe/bounswe2024group3/pull/392)
- [Update PostCard.tsx to improve Like and Dislike buttons](https://github.com/bounswe/bounswe2024group3/pull/432)
- [Addition of follow/unfollow Button](https://github.com/bounswe/bounswe2024group3/pull/433)
- [Create CreatePostForm.test.tsx](https://github.com/bounswe/bounswe2024group3/pull/482)

#### Reviewed
- [add a theme controller](https://github.com/bounswe/bounswe2024group3/pull/381)
- [add routes and layout](https://github.com/bounswe/bounswe2024group3/pull/312)

#### Merged
- [add routes and layout](https://github.com/bounswe/bounswe2024group3/pull/312)

### Additional
- Actively contributed to team discussions and helped maintain a collaborative and efficient workflow.



## Member: Ekrem Bal (@ekrembal)

**Responsibilities**:  
As a part of the frontend team, I worked on implementing key features and testing functionalities for the web application. I closely collaborated with Onur (@onurdilsiz) to ensure seamless integration of features. I reviewed his work and incorporated feedback into my implementations, and vice versa, to maintain high code quality and team collaboration.

---

### **Main Contributions**
1. Developed and refined the recommendation sidebar to enhance user engagement.  
2. Improved the user interface for post creation, ensuring a better user experience.  
3. Added and enhanced testing for Spotify URL parsing functionality to ensure robust link handling.  
4. Fixed and improved context handling across components for consistent application behavior.  

---

### **API Contributions**
- **Endpoint Used**: Spotify link parsing utility.  
  **Scenario**: The utility ensures that Spotify links embedded in posts are correctly parsed and displayed. This was crucial for the recommendation sidebar and post creation features to function smoothly.  
  - **Example Input**: A Spotify track URL.  
  - **Example Output**: Parsed track ID ready to be used by the API.  
  This functionality was incorporated into features like recommendations and create-post workflows.

---

### **Code-Related Significant Issues**  
1. [**Add tests for Spotify URL parsing** (#447)](https://github.com/bounswe/bounswe2024group3/issues/447): Added comprehensive tests for URL parsing to validate different Spotify links.  
2. [**Recommendation Sidebar** (#397)](https://github.com/bounswe/bounswe2024group3/issues/397): Implemented the recommendation sidebar, mocked with the latest posted tracks for the demo.  
3. [**Searchbar Fix** (#390)](https://github.com/bounswe/bounswe2024group3/issues/390): Fixed context and improved the search bar functionality.

---

### **Management-Related Significant Issues**  
- Coordinated closely with Onur on reviewing pull requests and ensuring feature alignment with project goals.

---

### **Pull Requests**
1. [**Fix Context** (#475)](https://github.com/bounswe/bounswe2024group3/pull/475): Addressed uncaught errors, fixed the feed page, and added search functionalities.  
2. [**Add Recommendations** (#455)](https://github.com/bounswe/bounswe2024group3/pull/455): Implemented a sidebar with mocked recommendations for the demo.  
3. [**Fix Post Creating UI** (#452)](https://github.com/bounswe/bounswe2024group3/pull/452): Improved the UI for the post creation modal.  
4. [**Add Test for Spotify Link Generator** (#456)](https://github.com/bounswe/bounswe2024group3/pull/456): Added and enhanced tests for Spotify link generation functionality.  
5. [**Add Jest as Dev Dependency and Add Request Tests** (#435)](https://github.com/bounswe/bounswe2024group3/pull/435): Integrated Jest for testing and added tests for request utility functions.

---

### **Additional Information**  
- Collaborated actively with Onur (@onurdilsiz) in code reviews, providing constructive feedback.  
- Addressed issues promptly to meet the requirements of Milestone 2.  
- Actively ensured the team adhered to clean code practices and proper testing.
