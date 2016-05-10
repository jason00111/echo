import test from 'ava'

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import CandidateGoal from '../CandidateGoal'
import styles from '../CandidateGoal.css'
import factory from '../../../test/factories'

let mockCandidateGoal
test.before(async () => {
  const goalRankOverwrites = Array.from(Array(3).keys()).map(i => ({goalRank: i}))
  mockCandidateGoal = {
    playerGoalRanks: await factory.buildMany('playerGoalRank', goalRankOverwrites, goalRankOverwrites.length),
    goal: {
      url: 'https://github.com/GuildCraftsTesting/web-development-js-testing/issues/40',
      title: 'the goal title (#40)',
    },
  }
})

test('renders the goal name', async t => {
  t.plan(1)

  const root = TestUtils.renderIntoDocument(
    React.createElement(CandidateGoal, {
      currentUser: await factory.build('player'),
      candidateGoal: mockCandidateGoal,
    })
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.true(rootNode.textContent.indexOf(mockCandidateGoal.goal.title) >= 0)
})

test('renders the number of votes', async t => {
  t.plan(1)

  const root = TestUtils.renderIntoDocument(
    React.createElement(CandidateGoal, {
      currentUser: await factory.build('player'),
      candidateGoal: mockCandidateGoal,
    })
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.true(rootNode.textContent.indexOf(`${mockCandidateGoal.playerGoalRanks.length}`) >= 0)
})

test('renders a link to the goal', async t => {
  t.plan(1)

  const root = TestUtils.renderIntoDocument(
    React.createElement(CandidateGoal, {
      currentUser: await factory.build('player'),
      candidateGoal: mockCandidateGoal,
    })
  )
  const link = TestUtils.findRenderedDOMComponentWithTag(root, 'a')

  t.is(link.href, mockCandidateGoal.goal.url)
})

test('provides an indication that the current player voted for the given goal', async t => {
  t.plan(1)

  const currentUser = await factory.build('player')
  const mcg = Object.assign({}, mockCandidateGoal)
  mcg.playerGoalRanks[0].playerId = currentUser.id
  const root = TestUtils.renderIntoDocument(
    React.createElement(CandidateGoal, {
      currentUser,
      candidateGoal: mcg,
    })
  )
  const votedEls = TestUtils.scryRenderedDOMComponentsWithClass(root, styles.voted)

  t.true(votedEls.length > 0)
})