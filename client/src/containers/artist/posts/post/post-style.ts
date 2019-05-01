export const styles = (theme) => ({
  card: {
    maxWidth: 500,
    borderRadius: 0,
    boxShadow: 'none',
  },

  header: {
    height: 70,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  media: {
    height: 340,
    paddingTop: '56.25%', // 16:9
  },

  actions: {
    display: 'flex',
  },

  iconButton: {
    outline: 'none !important',
  },

  userImage: {
    fontSize: 40,
    marginRight: 10,
  },

  postDate: {
    fontFamily: `Courier, 'Courier New', monospace`,
    color: '#aaaaab',
    fontSize: '12px !important',
  },

  postBody: {
    fontFamily: `Courier, Courier New, monospace !important`,
    fontSize: `14px !important`,
    marginBottom: `0px !important`,
  },

  postTitle: {
    display: 'flex',
    fontFamily: 'inherit !important',
    fontSize: '18px !important',
    letterSpacing: '0.3px',
    alignItems: 'center',
  },
});
