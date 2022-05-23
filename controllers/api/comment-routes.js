const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// get all comments
router.get("/", (req, res) => {
  Comment.findAll()
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// add comment
router.post("/", withAuth, (req, res) => {
  Comment.create({
    comment_body: req.body.comment_body,
    user_id: req.session.user_id,
    post_id: req.body.post_id,
  })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log("error encountered", err);
      res.status(500).json(err);
    });
});

// update comment
router.put("/:id", withAuth, (req, res) => {
  Comment.update(
    {
      comment_body: req.body.comment_body,
      user_id: req.session.user_id,
      post_id: req.body.post_id,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No comment body" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log("error encountered", err);
      res.status(500).json(err);
    });
});

// delete comment
router.delete("/:id", withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
      user_id: req.session.user_id,
    },
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: "No comment found" });
        return;
      }
      res.json(dbCommentData);
    })
    .catch((err) => {
      console.log("error encountered", err);
      res.status(500).json(err);
    });
});

module.exports = router;
