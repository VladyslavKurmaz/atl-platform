import makeAddVacancy from './add-vacancy'
import vacanciesDb from '../storages'

const addVacacny = makeAddVacacny({ commentsDb, handleModeration })
const editComment = makeEditComment({ commentsDb, handleModeration })
const listComments = makeListComments({ commentsDb })
const removeComment = makeRemoveComment({ commentsDb })

const commentService = Object.freeze({
  addComment,
  editComment,
  handleModeration,
  listComments,
  removeComment
})

export default commentService
export { addComment, editComment, listComments, removeComment }