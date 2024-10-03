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
  // displayArea
} from './moduleWindowStyling'

import ReactMarkdown from 'react-markdown';



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
    const inputValue = e.target.value;
    const lines = inputValue.split('\n'); 
    setQuestion(e.target.value)

    // input length limit
    // const limitedLines = lines.map(line => {
    //   return line.length > 50 ? line.substring(0, 50) : line;
    // });
    // setQuestion(limitedLines.join('\n')); 

    setQuestion(inputValue);
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
  // out put controls 
  // const formattedInstructions = question.split('\n').map((line, index) => (
  //   <React.Fragment key={index}>
  //     {line}
  //     <br />
  //   </React.Fragment>
  // ))

  // const MarkdownDisplay = ({ question }) => {
  //   const formattedInstructions = question.replace(/\n/g, '\n\n');
  //   return (
  //     <div>
  //       <h3>Instructions:</h3>
  //       <ReactMarkdown>{formattedInstructions}</ReactMarkdown>
  //     </div>
  //   );
  // }

  // const formattedInstructions = (
  //   <div>
  //     <ReactMarkdown>{question}</ReactMarkdown>
  //   </div>
  // );

  // the change on button commands
  const [newQuestion, setNewQuestion] = useState('') 

  const scrollToQuestion = (index) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center', // current one at center 
      });
    }
  };

  // test 2 





  return (
    <ModuleWindowWrapper ref={panelRef} width={panelWidth}>
      <CloseButton onClick={handleClose}>x</CloseButton>
      <div>
        <TitleWrapper>

          
          <Title>Question {currentQuestionIndex + 1} /  {Object.keys(questions).length}</Title>
          
          <EditButton $active={isEditing} onClick={handleEditClick}>
            {isEditing ? 'Save' : 'Edit'}
          </EditButton>
        </TitleWrapper>
        <hr />
        {/* test here */}
     

        <Content  >
          {isEditing
            ? (
            <Textarea
              value={question}
              onChange={handleQuestionChange}
              style={{ height: '60vh' }} 
              placeholder="Edit module instructions here"
            />
            ): (
              <div style={{

                width: '100%',
                height: '60vh',
                backgroundColor: 'var(--surface)', // 与 Textarea 的背景相同
                color: 'var(--white)', // 与 Textarea 的文本颜色相同
                border: '1px solid var(--white)', // 与 Textarea 的边框相同
                padding: '1px', // 与 Textarea 的内边距相同
                borderRadius: '0.3em', // 与 Textarea 的圆角相同
                overflowY: 'scroll', // 允许滚动
                // whiteSpace: 'pre-wrap',
                scrollbarWidth: 'thin', // Firefox 仅支持
                scrollbarColor: 'var(--gray) var(--surface)', // Firefox 仅支持
                textAlign: 'left', // Align text to the left
                // display: 'flex', // Enable flexbox
                flexDirection: 'column', // Align children in a column
                // justifyContent: 'flex-start', // Align items to the start of the container
                // alignItems: 'flex-start', // Align items to the left
                lineHeight : '2em'

              }}>
             
                <ReactMarkdown>
                  {question}
                </ReactMarkdown>

                  {/* {formattedInstructions} */}
              </div>
              )}
        </Content>
      </div>

      <PaginationWrapper>


        <div>     {/* the scrollable ver   */}


   
        {/* <PaginationButton
            onClick={() => handlePageChange(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            &lt;
        </PaginationButton> */}



            
          {/* test here */}  
        {/* <PaginationButton
              onClick={() => {
                const newIndex = currentQuestionIndex - 1;
                handlePageChange(newIndex);
                scrollToQuestion(newIndex);
              }}
              disabled={currentQuestionIndex === 0}
            >
              &lt;
        </PaginationButton> */}

          {/* Scrollable container for question buttons */}
          {/* <div style={{ display: 'flex', 
                        overflowX: 'auto', 
                        whiteSpace: 'nowrap' ,
                        scrollbarWidth: 'none',
                        scrollbarColor: 'var(--primary) #e0e0e0',
                        }}>
            {Object.entries(questions).map(([id, _], index) => (

              // this is question card list 

              <PaginationButton
                key={id}
                onClick={() => {
                  handlePageChange(index);
                  scrollToQuestion(index); // Scroll to the clicked question
                }}
                id={`question-${index}`} // Unique ID for each button
                style={{
                  margin: '0 5px', // Space between buttons
                  backgroundColor: index  === currentQuestionIndex ? 'gray' : 'var(--primary)', 
                  border: index === currentQuestionIndex ? '1px solid white' : '1px solid transparent', 

                }}
              >
                Q{index + 1}
              </PaginationButton>

            ))}
          </div> */}

        {/* <PaginationButton
            onClick={() =>{
              const newIndex = currentQuestionIndex + 1;
              handlePageChange(newIndex)
              scrollToQuestion(newIndex);

            }}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            &gt;
        </PaginationButton> */}
     </div>





      <PaginationButton
        onClick={() => {
          if (currentQuestionIndex > 0) {
            const newIndex = currentQuestionIndex - 1;
            handlePageChange(newIndex);
          }
        }}
        disabled={currentQuestionIndex === 0}
        style={{
          backgroundColor: currentQuestionIndex > 0 ? 'var(--primary)' : 'transparent',
          margin: '0 2px',
          flex: 1,
        }}
      >
        &lt;
      </PaginationButton>
        {currentQuestionIndex > 0 ? (
      <PaginationButton
        onClick={() => handlePageChange(currentQuestionIndex - 1)}
        style={{
          backgroundColor: 'var(--primary)',
          margin: '0 2px',
          flex: 1,
        }}
      >
        Q{currentQuestionIndex}
      </PaginationButton>
        ) : (
          <div style={{ flex: 1 }}></div> // Empty space when no previous question
        )}



{/*   current button  */}

      <PaginationButton
        disabled
        style={{
          backgroundColor: 'gray',
          margin: '0 2px',
          flex: 1,
        }}
      >
        Q{currentQuestionIndex + 1}
      </PaginationButton>


        {/* Next question button (only if exists) */}
      {currentQuestionIndex < totalQuestions - 1 ? (
        <PaginationButton
          onClick={() => handlePageChange(currentQuestionIndex + 1)}
          style={{
            backgroundColor: 'var(--primary)',
            margin: '0 2px',
            flex: 1,
          }}
        >
          Q{currentQuestionIndex + 2}
        </PaginationButton>
      ) : (
        <div style={{ flex: 1 }}></div> // Empty space when no next question
      )}




<PaginationButton
  onClick={() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const newIndex = currentQuestionIndex + 1;
      handlePageChange(newIndex);
    }
  }}
  disabled={currentQuestionIndex === totalQuestions - 1}
  style={{
    backgroundColor: currentQuestionIndex < totalQuestions - 1 ? 'var(--primary)' : 'transparent',
    margin: '0 2px',
    flex: 1,
  }}
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
