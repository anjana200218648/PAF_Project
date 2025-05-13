import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/Input/Input";
import {
  IUser,
  useAuthentication,
} from "../../../authentication/contexts/AuthenticationContextProvider";

import { TimeAgo } from "../TimeAgo/TimeAgo";
import classes from "./Comment.module.scss";

export interface IComment {
  id: number;// Unique identifier for the comment
  content: string; // Text content of the comment
  author: IUser; // The user who posted the comment
  creationDate: string;// The date when the comment was created
  updatedDate?: string;// Optional, the date when the comment was last updated

}

interface ICommentProps {// Props interface for the Comment component
  comment: IComment;// The comment data passed as props
  deleteComment: (commentId: number) => Promise<void>;// Function to delete a comment
  editComment: (commentId: number, content: string) => Promise<void>;// Function to edit a comment
}
// Main Comment component function
export function Comment({ comment, deleteComment, editComment }: ICommentProps) {
  const navigate = useNavigate();// React Router hook for navigation
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);// State to control visibility of action buttons (Edit/Delete)
  const [commentContent, setCommentContent] = useState(comment.content);
  const { user } = useAuthentication();// Retrieve the current authenticated user
  return (
    <div key={comment.id} className={classes.root}>
      {!editing ? (
        <>
          <div className={classes.header}>
            <button
              onClick={() => {
                navigate(`/profile/${comment.author.id}`);
              }}
              className={classes.author}
            >
              <img
                className={classes.avatar}
                src={comment.author.profilePicture || "/avatar.svg"}
                alt=""
              />
              <div>
                <div className={classes.name}>
                  {comment.author.firstName + " " + comment.author.lastName}
                </div>
                <div className={classes.title}>
                  {comment.author.position + " at " + comment.author.company}
                </div>
                <TimeAgo date={comment.creationDate} edited={!!comment.updatedDate} />
              </div>
            </button>
            {comment.author.id == user?.id && (
              <button
                className={`${classes.action} ${showActions ? classes.active : ""}`}
                onClick={() => setShowActions(!showActions)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                </svg>
              </button>// If editing, show an input field for updating the comment
            )}
                 
            {showActions && (
              <div className={classes.actions}>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => deleteComment(comment.id)}>Delete</button>
              </div>
            )}
          </div>
          <div className={classes.content}>{comment.content}</div>
        </>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await editComment(comment.id, commentContent);
            setEditing(false);
            setShowActions(false);
          }}
        >
          <Input
            type="text"
            value={commentContent}
            onChange={(e) => {
              setCommentContent(e.target.value);
            }}
            placeholder="Edit your comment"
          />
        </form>
      )}
    </div>
  );
}

export default Comment;
