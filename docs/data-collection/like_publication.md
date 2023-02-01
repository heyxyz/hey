# Properties collection for the `like_publication` event

## Event description

The `like_publication` event is triggered when a user likes a publication.

## Event properties

### `like_by`

The profile id of the user that liked the publication.

Example: `0x0d`

### `like_publication`

The publication id of the publication that was liked.

Example: `0x0d-0x01`

### `like_source`

| **Source name** | **Description**              |
| --------------- | ---------------------------- |
| `home_feed`     | Liked from the home feed.    |
| `profile_feed`  | Liked from the profile feed. |
| `explore_feed`  | Liked from the explore feed. |
| `post_page`     | Liked from the post page.    |
