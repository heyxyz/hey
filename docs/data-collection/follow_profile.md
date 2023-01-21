# Properties collection for the `follow_profile` event

## Event description

The `follow_profile` event is triggered when a user follows another user's profile.

## Event properties

### `follow_path`

The path of the current webpage user's profile that was followed.

Example: `/u/[username]`

### `follow_source`

The place where the user followed another user's profile.

| **Source name**                 | **Description**                                    |
| ------------------------------- | -------------------------------------------------- |
| `who_to_follow`                 | Who to follow section.                             |
| `who_to_follow_modal`           | Who to follow modal shows on clicking show more.   |
| `likes_modal`                   | Likes modal in publication page.                   |
| `mirrors_modal`                 | Mirrors modal in publication page.                 |
| `collectors_modal`              | Collectors modal in publication page.              |
| `followers_modal`               | Followers modal in profile page.                   |
| `following_modal`               | Following modal in profile page.                   |
| `mutual_followers_modal`        | Mutual followers modal in profile page.            |
| `publication_relevant_profiles` | Publication relevant profiles in publication page. |
| `direct_message_header`         | Direct message header in DMs.                      |
| `profile_page`                  | Profile page.                                      |
| `profile_popover`               | Profile popover when hover on profile.             |

### `follow_position`

The position of the user profile in the list of profiles.

Example: `2`

### `follow_from`

The current profile id of the user that is following another user's profile.

Example: `0x0d`

### `follow_target`

The profile id of the user that was followed.

Example: `0x2d`
