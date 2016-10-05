'use strict'

const React = require('react')

module.exports = (props) => (
  let selectedTagClasses = props.classNames.selectedTag;

  if (props.tag.invalid) {
    selectedTagClasses += 'invalid-tag';
  }

  <button type='button' className={props.classNames.selectedTag} title='Click to remove tag' onClick={props.onDelete}>
    <span className={props.classNames.selectedTagName}>{props.tag.name}</span>
    <span className='smf-icon'></span>
  </button>
)
