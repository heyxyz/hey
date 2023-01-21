# Properties collection for the `dislike_publication` event

## Event description

The `dislike_publication` event is triggered when a user dislikes a publication.

## Event properties

### `dislike_by`

The profile id of the user that disliked the publication.

Example: `0x0d`

### `dislike_publication`

The publication id of the publication that was disliked.

Example: `0x0d-0x01`

### `dislike_source`

| **Source name** | **Description**                 |
| --------------- | ------------------------------- |
| `home_feed`     | Disliked from the home feed.    |
| `profile_feed`  | Disliked from the profile feed. |
| `explore_feed`  | Disliked from the explore feed. |
| `post_page`     | Disliked from the post page.    |
