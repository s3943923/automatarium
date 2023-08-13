import { useEffect, useState } from 'react'
import { useEvent } from '/src/hooks'
import { useProjectStore } from '/src/stores'
import { BaseAutomataTransition, FSAAutomataTransition, PDAAutomataTransition, TMAutomataTransition, assertType } from '/src/types/ProjectTypes'
import Modal from '/src/components/Modal/Modal'
import Button from '/src/components/Button/Button'
import Input from '/src/components/Input/Input'
import { InputWrapper, SubmitButton } from '/src/components/InputDialogs/inputDialogsStyle'
import { CornerDownLeft } from 'lucide-react'

const InputTransitionGroup = () => {
  const [fromState, setFromState] = useState<number>()
  const [toState, setToState] = useState<number>()
  const [transitionsList, setTransitionsList] = useState<Array<BaseAutomataTransition> | undefined>()

  const [modalOpen, setModalOpen] = useState(false)

  const [idList, setIdList] = useState([])

  // For the new transition
  const [readValue, setReadValue] = useState('')
  const [popValue, setPopValue] = useState('')
  const [pushValue, setPushValue] = useState('')
  const [writeValue, setWriteValue] = useState('')
  const [dirValue, setDirValue] = useState('')

  const statePrefix = useProjectStore(s => s.project.config.statePrefix)
  const projectType = useProjectStore(s => s.project.config.type)

  const editTransition = useProjectStore(s => s.editTransition)
  const createTransition = useProjectStore(s => s.createTransition)
  const commit = useProjectStore(s => s.commit)
  // Get data from event dispatch
  useEvent('editTransitionGroup', ({ detail: { ids } }) => {
    // Get transitions from store
    const { transitions } = useProjectStore.getState()?.project ?? {}
    setIdList([...ids])
    const transitionsScope = transitions.filter(t => ids.includes(t.id))
    // All of these should be part of the same transition edge
    setFromState(transitionsScope[0].from)
    setToState(transitionsScope[0].to)
    setTransitionsList(transitionsScope)
    setModalOpen(true)
  })

  const retrieveTransitions = () => {
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter(t => idList.includes(t.id))
    setTransitionsList([...transitionsScope])
  }

  const resetInputFields = () => {
    setReadValue('')
    setPopValue('')
    setPushValue('')
    setWriteValue('')
    setDirValue('')
  }

  const createNewTransition = () => {
    const newId = createTransition({ from: fromState, to: toState })
    setIdList([...idList, newId])
    return newId
  }

  // Re-retrieve transitions when the id list changes (i.e. on new transition)
  useEffect(() => {
    retrieveTransitions()
  }, [idList])

  /**
   * Functions for FSAs
   */
  const saveFSATransition = ({ id, read }) => {
    editTransition({ id, read })
    commit()
    retrieveTransitions()
  }

  const saveNewFSATransition = () => {
    const newId = createNewTransition()
    editTransition({ id: newId, read: readValue } as FSAAutomataTransition)
    commit()
    resetInputFields()
  }

  const blankFSAInput = () => <InputWrapper>
    <Input
      value={readValue}
      onChange={e => setReadValue(e.target.value)}
      placeholder={'λ (New transition)'}
    />
    <SubmitButton onClick={saveNewFSATransition}>
      <CornerDownLeft size='18px' />
    </SubmitButton>
  </InputWrapper>

  /**
   * Functions for PDAs
   */
  const savePDATransition = ({ id, read, pop, push }) => {
    editTransition({ id, read, pop, push } as PDAAutomataTransition)
    commit()
    retrieveTransitions()
  }

  const saveNewPDATransition = () => {
    const newId = createNewTransition()
    editTransition({
      id: newId,
      read: readValue,
      pop: popValue,
      push: pushValue
    } as PDAAutomataTransition)
    commit()
    resetInputFields()
  }

  const blankPDAInput = () => <InputWrapper>
    <Input
      value={readValue}
      onChange={e => setReadValue(e.target.value)}
      placeholder={'λ\t(read)'}
    />
    <Input
      value={popValue}
      onChange={e => setPopValue(e.target.value)}
      placeholder={'λ\t(pop)'}
    />
    <Input
      value={pushValue}
      onChange={e => setPushValue(e.target.value)}
      placeholder={'λ\t(push)'}
    />
    <SubmitButton onClick={saveNewPDATransition}>
      <CornerDownLeft size='18px' />
    </SubmitButton>
  </InputWrapper>

  /**
   * Functions for TMs
   */
  const saveTMTransition = ({ id, read, write, direction }) => {
    editTransition({ id, read, write, direction: direction || 'R' } as TMAutomataTransition)
    commit()
    retrieveTransitions()
  }

  const saveNewTMTransition = () => {
    const newId = createNewTransition()
    editTransition({
      id: newId,
      read: readValue,
      write: writeValue,
      direction: dirValue
    } as TMAutomataTransition)
    commit()
    resetInputFields()
  }

  const blankTMInput = () => <InputWrapper>
    <Input
      value={readValue}
      onChange={e => setReadValue(e.target.value)}
      placeholder={'λ\t(read)'}
    />
    <Input
      value={writeValue}
      onChange={e => setWriteValue(e.target.value)}
      placeholder={'λ\t(write)'}
    />
    <Input
      value={dirValue}
      onChange={e => setDirValue(e.target.value)}
      placeholder={'↔\t(direction)'}
    />
    <SubmitButton onClick={saveNewTMTransition}>
      <CornerDownLeft size='18px' />
    </SubmitButton>
  </InputWrapper>

  /**
   * Modal contents
   */

  if (!transitionsList) return null

  const contents = () => {
    switch (projectType) {
      case 'FSA':
        assertType<Array<FSAAutomataTransition>>(transitionsList)
        return <>
          {transitionsList.map((t, i) => <Input
              key={i}
              value={t.read}
              onChange={e => saveFSATransition({ id: t.id, read: e.target.value })}
              placeholder={'λ'}
          />)}
          <hr/>
          {blankFSAInput()}
        </>
      case 'PDA':
        assertType<Array<PDAAutomataTransition>>(transitionsList)
        return <>
          {transitionsList.map((t, i) => <InputWrapper key={i}>
            <Input
              value={t.read}
              onChange={e => savePDATransition({
                id: t.id,
                read: e.target.value,
                pop: t.pop,
                push: t.push
              })}
              placeholder={'λ\t(read)'}
              />
            <Input
              value={t.pop}
              onChange={e => savePDATransition({
                id: t.id,
                read: t.read,
                pop: e.target.value,
                push: t.push
              })}
              placeholder={'λ\t(pop)'}
              />
            <Input
              value={t.push}
              onChange={e => savePDATransition({
                id: t.id,
                read: t.read,
                pop: t.pop,
                push: e.target.value
              })}
              placeholder={'λ\t(push)'}
            />
          </InputWrapper>)}
          <hr/>
          {blankPDAInput()}
        </>
      case 'TM':
        assertType<Array<TMAutomataTransition>>(transitionsList)
        return <>
          {transitionsList.map((t, i) => <InputWrapper key={i}>
            <Input
              value={t.read}
              onChange={e => saveTMTransition({
                id: t.id,
                read: e.target.value,
                write: t.write,
                direction: t.direction
              })}
              placeholder={'λ\t(read)'}
            />
            <Input
              value={t.write}
              onChange={e => saveTMTransition({
                id: t.id,
                read: t.read,
                write: e.target.value,
                direction: t.direction
              })}
              placeholder={'λ\t(write)'}
            />
            <Input
              value={t.direction}
              onChange={e => saveTMTransition({
                id: t.id,
                read: t.read,
                write: t.write,
                direction: e.target.value
              })}
              placeholder={'↔\t(direction)'}
            />
          </InputWrapper>
          )}
          <hr/>
          {blankTMInput()}
        </>
    }
  }

  return <Modal
    title='Transition Edge Editor'
    description={
        'Editing transition from ' +
        statePrefix + fromState + ' to ' +
        statePrefix + toState + '.'
      }
    isOpen={modalOpen}
    actions={<Button onClick={() => {
      setModalOpen(false)
      resetInputFields()
    }}>Done</Button>}
  >
    {contents()}
  </Modal>
}

export default InputTransitionGroup
