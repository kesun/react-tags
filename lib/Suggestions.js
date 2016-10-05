'use strict'

const React = require('react')

function escapeForRegExp (query) {
  return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function markIt (input, query) {
  const regex = RegExp(escapeForRegExp(query), 'gi')

  return {
    __html: input.replace(regex, '<mark>$&</mark>')
  }
}

function filterSuggestions (query, suggestions, length) {
  const regex = new RegExp(`(?:^|\\s)${escapeForRegExp(query)}`, 'i')
  return suggestions.filter((item) => regex.test(item.name)).slice(0, length)
}

class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      options: filterSuggestions(this.props.query, this.props.suggestions, this.props.maxSuggestionsLength)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      options: filterSuggestions(newProps.query, newProps.suggestions, newProps.maxSuggestionsLength)
    })
  }

  render () {
    if (!this.props.expandable || !this.state.options.length) {
      return null
    }

    const options = this.state.options.map((item, i) => {
      const key = `${this.props.listboxId}-${i}`
      const classNames = []

      if (this.props.selectedIndex === i) {
        classNames.push(this.props.classNames.suggestionActive)
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.suggestionDisabled)
      }

      if (item.id === 0) {
        classNames.push('suggestion-invite-all')
        return (
          <li
            id={key}
            key={key}
            role='option'
            className={classNames.join(' ')}
            aria-disabled={item.disabled === true}
            onMouseDown={() => this.props.addTag(item)}>
            <div>
              <div className='suggestion-name'>{item.name}</div>
            </div>
            <div className='suggestion-role'>{item.role}</div>
          </li>
        )
      }

      return (
        <li
          id={key}
          key={key}
          role='option'
          className={classNames.join(' ')}
          aria-disabled={item.disabled === true}
          onMouseDown={() => this.props.addTag(item)}>
          <div>
            <div className='suggestion-name' dangerouslySetInnerHTML={markIt(item.name, this.props.query)}></div>
            <div className='suggestion-email' dangerouslySetInnerHTML={markIt(item.email, this.props.query)} style={{ fontSize: '12px' }}></div>
          </div>
          <div className='suggestion-role'>{item.role}</div>
        </li>
      )
    })

    return (
      <div className={this.props.classNames.suggestions}>
        <ul role='listbox' id={this.props.listboxId}>{options}</ul>
      </div>
    )
  }
}

module.exports = Suggestions
