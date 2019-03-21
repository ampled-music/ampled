
## Permissions Proposal

Note: I’m using the terminology `visitor` to describe someone who is viewing an artist page, but does not yet support that artist.

### Artist Pages

**Backend / API**
 * The JSON for each artist_page will include a `current_user_role` key, which will have one of 3 values:
   * `visitor`
   * `supporter`
   * `owner`

**Front End**
 * The Support Button will change for supporters and owners.
 * Supporters will see all posts (see below).
 * Owners will be allowed to compose a post.


### Posts

**Backend / API**
  * Elements of `artist_page.posts` will contain `author_id`
  * The JSON for each element of `artist_page.posts` will include a `public` key, which will be boolean (true/false).
  * Elements of `artist_page.posts` that are not `public` will contain **only** `id` and `public` for Visitors.
  * Creating a Post will be restricted to Aritst Page Owners.
  
**Frontend**
  * Posts will appear as blurred placeholders to Visitors. 

### Comments

**Backend / API**
  * Elements of `artist_page.post.comments` will contain `author_id`
  * Only Supporters of an Artist Page will be permitted to add comments to posts on that page.
  * Only the Author of a comment or Owners of the parent Artist Page will be permitted to delete a comment.
  
**Frontend**
  * The Author of a comment, as well as Owners of the current page will have the option to delete the comment.
