import React, { useState, useEffect, useRef } from 'react'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import {
  ModuleWindowWrapper,
  Textarea,
  PaginationWrapper,
  PaginationButton,
  SelectBox,
  ResizeHandle,
  CloseButton,
  TitleWrapper,
  Title,
  EditButton,
  Content
} from './moduleWindowStyling'

const ModuleWindow = () => {
  const currentModule = useModuleStore(s => s.module)
  const updateQuestion = useModuleStore(s => s.upsertQuestion)
  const updateProject = useModuleStore(s => s.upsertProject)
  const questions = currentModule.questions
  const totalQuestions = Object.keys(questions).length
  const currentProject = useProjectStore(s => s.project)
  const currentQuestionIndex = currentModule.projects.findIndex(project => project._id === currentProject._id)
  const updateModule = useModulesStore(s => s.upsertModule)
  const setProject = useProjectStore(s => s.set)
  const currentQuestion = questions[currentProject._id]
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)

  const [panelWidth, setPanelWidth] = useState('250px')
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [question, setQuestion] = useState(currentQuestion || '')

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startWidth = panelRef.current ? panelRef.current.offsetWidth : 250

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX)
      setPanelWidth(`${newWidth}px`)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleClose = () => {
    setShowModuleWindow(false) // Close the module panel
  }

  useEffect(() => {
    // Ensure that the question is updated when the current question or module changes
    if (currentModule && currentProject._id) {
      setQuestion(questions[currentProject._id] || '')
    }
  }, [currentModule, currentProject._id])

  const saveModule = () => {
    const project = useProjectStore.getState().project
    updateProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    updateModule(currentModule)
  }

  const handleEditClick = () => {
    if (isEditing) {
      const currentQuestionId = Object.keys(questions)[currentQuestionIndex]
      updateQuestion(currentQuestionId, question)
      updateModule(currentModule)
    }
    setIsEditing(!isEditing)
  }

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
  }

  const handlePageChange = (index: number) => {
    saveModule()
    setProject(currentModule.projects[index])
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestionIndex = parseInt(e.target.value, 10)
    handlePageChange(selectedQuestionIndex)
  }

  // If there are no questions or module data yet, show a loading or fallback message
  if (!questions || totalQuestions === 0 || !currentModule) {
    return <ModuleWindowWrapper width={panelWidth}>Loading module instructions...</ModuleWindowWrapper>
  }

  const formattedInstructions = question.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))



  // the change on button commands
  const [newQuestion, setNewQuestion] = useState('') 
  


  return (
    <ModuleWindowWrapper ref={panelRef} width={panelWidth}>
      <CloseButton onClick={handleClose}>x</CloseButton>
      <div>
        <TitleWrapper>

          
          <Title>Question {currentQuestionIndex + 1}</Title>
          
          <EditButton $active={isEditing} onClick={handleEditClick}>
            {isEditing ? 'Save' : 'Edit'}
          </EditButton>
        </TitleWrapper>
        <hr />
        {/* test here */}
        <Title>Number of Questions: {Object.keys(questions).length}</Title>

        {Object.keys(questions).length > 1 ? (
          <Content>Yeah</Content>
        ) : (
          <Content>Nah</Content>
        )}
        {/* test here */}
        <Content>
          {isEditing
            ? (
            <Textarea
              value={question}
              onChange={handleQuestionChange}
              placeholder="Edit module instructions here"
            />
              )
            : (
            <>{formattedInstructions}</>
              )}
        </Content>
      </div>

      <PaginationWrapper>
        {/* <PaginationButton
            onClick={() => handlePageChange(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            &lt;
        </PaginationButton> */}

            
          {/* test here */}  
          <PaginationButton
            onClick={() => handlePageChange(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            &lt;
          </PaginationButton>

          {/* Scrollable container for question buttons */}
          <div style={{ display: 'flex', 
                        overflowX: 'auto', 
                        whiteSpace: 'nowrap' ,
                        scrollbarWidth: 'none',
                        scrollbarColor: 'var(--primary) #e0e0e0',
                        }}>
            {Object.entries(questions).map(([id, _], index) => (

              // this is quesion card

              <PaginationButton
                key={id}
                onClick={() => handlePageChange(index)}
                style={{
                  margin: '0 5px', // Space between buttons
                  whiteSpace: 'nowrap', // Prevent text wrap


                  backgroundColor: index  === currentQuestionIndex ? 'gray' : 'var(--primary)', // Gray for current question
                  border: index === currentQuestionIndex ? '1px solid white' : '1px solid transparent', // Highlight border for current question



                }}
              >
                Q{index + 1}
              </PaginationButton>


            ))}
          </div>

          <PaginationButton
            onClick={() => handlePageChange(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            &gt;
          </PaginationButton>

            {/* test here */}





        

        {/* <SelectBox value={currentQuestionIndex} onChange={handleSelectChange}>
          {Object.entries(questions).map(([id], index) => (
            <option key={id} value={id}>
              Question {index + 1}
            </option>
          ))}
        </SelectBox> */}


        {/* <PaginationButton
          onClick={() => handlePageChange(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === totalQuestions - 1}
        >
          &gt;
        </PaginationButton> */}
      </PaginationWrapper>
      <ResizeHandle onMouseDown={handleMouseDown} />
    </ModuleWindowWrapper>
  )
}

export default ModuleWindow
