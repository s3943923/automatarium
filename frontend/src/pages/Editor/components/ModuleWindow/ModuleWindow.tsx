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
  import rehypeSanitize from 'rehype-sanitize';
  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
  import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
  


  
// const MarkdownEditor = () => {
//   const [markdown, setMarkdown] = useState('## Code Block Example\n```javascript\nconsole.log(\'Hello, World!\');\n```');



  const ModuleWindow = () => {



    const sanitizeOptions = {
      tagNames: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
      attributes: {
        a: ['href', 'title'],
      },
    };
  
    const handleInputChange = (e) => {
      setMarkdown(e.target.value);
    };
    
    const [markdown, setMarkdown] = useState('## Code Block Example\n```javascript\nconsole.log(\'Hello, World!\');\n```');
  

    
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

    

    // If there are no questions or module data yet, show a loading or fallback message
    if (!questions || totalQuestions === 0 || !currentModule) {
      return <ModuleWindowWrapper width={panelWidth}>Loading module instructions...</ModuleWindowWrapper>
    }
  
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
          <Content  >
            {isEditing
              ? (
                
              <Textarea           
                value={question}
                onChange={handleQuestionChange}

                placeholder="Edit module instructions here"
              />
              ): (
                <div>
              {/* <ReactMarkdown rehypePlugins={[[rehypeSanitize, sanitizeOptions]]}>
                {question}
              </ReactMarkdown> */}
     
                <ReactMarkdown
                      rehypePlugins={[[rehypeSanitize, sanitizeOptions]]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {question}
                    </ReactMarkdown>

                
                </div>
              )}
          </Content>
        </div>
        <PaginationWrapper>

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
            flex: 0,
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
            flex: 0,
            
          }}
        >
          Q{currentQuestionIndex}
        </PaginationButton>
          ) : (
            <div style={{ flex: 0 }}></div> // Empty space when no previous question
          )}
        <PaginationButton
          disabled
          style={{
            backgroundColor: 'gray',
            margin: '0 2px',
            flex: 0,
          }}
        >
          Q{currentQuestionIndex + 1}
        </PaginationButton>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <PaginationButton
            onClick={() => handlePageChange(currentQuestionIndex + 1)}
            style={{
              backgroundColor: 'var(--primary)',
              margin: '0 2px',
              flex: 0,
            }}
          >
            Q{currentQuestionIndex + 2}
          </PaginationButton>
        ) : (
          <div style={{ flex: 0 }}></div> // Empty space when no next question
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
        flex: 0,
      }}
    >
    &gt;
  </PaginationButton>
        </PaginationWrapper>
        <ResizeHandle onMouseDown={handleMouseDown} />
      </ModuleWindowWrapper>
    )
  }

  export default ModuleWindow
