import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlayCircle, CheckCircle, Award, Brain, Shield, AlertTriangle, Users, Target } from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Cyber' | 'Physical' | 'Operational' | 'Leadership';
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ThreatAwarenessTraining = () => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const trainingModules: TrainingModule[] = [
    {
      id: 'cyber-basics',
      title: 'Cybersecurity Fundamentals',
      description: 'Essential knowledge for protecting against cyber threats',
      duration: '45 minutes',
      difficulty: 'Beginner',
      category: 'Cyber',
      lessons: [
        {
          id: 'phishing',
          title: 'Recognizing Phishing Attacks',
          content: 'Phishing is one of the most common cyber threats. Attackers use deceptive emails, websites, or messages to trick you into revealing sensitive information or downloading malware.',
          keyPoints: [
            'Check sender email addresses carefully for misspellings or suspicious domains',
            'Hover over links to see the actual destination before clicking',
            'Be wary of urgent requests for personal information',
            'Verify requests through independent channels when in doubt',
            'Look for poor grammar, spelling, or formatting in communications'
          ]
        },
        {
          id: 'passwords',
          title: 'Password Security',
          content: 'Strong passwords are your first line of defense against unauthorized access. Creating and managing secure passwords is crucial for protecting your accounts.',
          keyPoints: [
            'Use unique passwords for each account',
            'Create passwords with at least 12 characters',
            'Include a mix of uppercase, lowercase, numbers, and symbols',
            'Consider using password managers for generating and storing passwords',
            'Enable two-factor authentication whenever possible'
          ]
        },
        {
          id: 'social-engineering',
          title: 'Social Engineering Tactics',
          content: 'Social engineering exploits human psychology rather than technical vulnerabilities. Attackers manipulate people into divulging confidential information.',
          keyPoints: [
            'Be suspicious of unsolicited contact claiming to be from IT or authority figures',
            'Never provide sensitive information over the phone unless you initiated the call',
            'Verify the identity of anyone requesting access to systems or information',
            'Be cautious about what information you share on social media',
            'Trust your instincts - if something feels wrong, investigate further'
          ]
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Which of the following is the BEST way to verify a suspicious email claiming to be from your bank?',
          options: [
            'Click the link in the email to check if it goes to the real bank website',
            'Reply to the email asking for verification',
            'Call your bank directly using a number from their official website or your bank card',
            'Forward the email to a colleague to get their opinion'
          ],
          correctAnswer: 2,
          explanation: 'Always verify suspicious communications through independent channels. Use official contact information, not what\'s provided in the suspicious communication.'
        },
        {
          id: 'q2',
          question: 'What makes a password strong?',
          options: [
            'It contains your name and birthday',
            'It\'s at least 12 characters with a mix of letters, numbers, and symbols',
            'It\'s easy to remember and type quickly',
            'It\'s the same across all your accounts for consistency'
          ],
          correctAnswer: 1,
          explanation: 'Strong passwords are long, complex, and unique. Using the same password across accounts creates a single point of failure.'
        },
        {
          id: 'q3',
          question: 'Someone calls claiming to be from IT and asks for your password to "update the system." What should you do?',
          options: [
            'Provide the password since they\'re from IT',
            'Ask them to call back later when you\'re less busy',
            'Refuse to give the password and verify their identity through official channels',
            'Give them a fake password to test if they\'re legitimate'
          ],
          correctAnswer: 2,
          explanation: 'Legitimate IT departments will never ask for your password. Always verify identity through official channels before providing any sensitive information.'
        }
      ]
    },
    {
      id: 'physical-security',
      title: 'Physical Security Awareness',
      description: 'Protecting physical assets and maintaining workplace security',
      duration: '30 minutes',
      difficulty: 'Beginner',
      category: 'Physical',
      lessons: [
        {
          id: 'access-control',
          title: 'Access Control and Tailgating',
          content: 'Physical access control is about ensuring only authorized individuals can enter secure areas. Tailgating occurs when unauthorized persons follow authorized individuals through access points.',
          keyPoints: [
            'Always use your own access card - never share with others',
            'Don\'t hold doors open for people you don\'t recognize',
            'Challenge unfamiliar individuals in secure areas politely but firmly',
            'Report lost or stolen access cards immediately',
            'Ensure doors close and lock behind you'
          ]
        },
        {
          id: 'clean-desk',
          title: 'Clean Desk Policy',
          content: 'A clean desk policy helps protect sensitive information from unauthorized viewing and reduces the risk of data theft or compromise.',
          keyPoints: [
            'Lock away sensitive documents when not in use',
            'Don\'t leave passwords written down and visible',
            'Log out of computers when leaving your desk',
            'Properly dispose of confidential documents using secure shredding',
            'Keep visitor areas free from sensitive information'
          ]
        }
      ],
      quiz: [
        {
          id: 'p1',
          question: 'Someone you don\'t recognize is following you through a secure door. What should you do?',
          options: [
            'Hold the door open to be polite',
            'Let them through since they might be a new employee',
            'Close the door and ask them to use their own access card',
            'Ignore them and continue to your destination'
          ],
          correctAnswer: 2,
          explanation: 'Always ensure people use their own access credentials. Politely ask them to badge in themselves or verify their authorization.'
        }
      ]
    },
    {
      id: 'crisis-leadership',
      title: 'Crisis Leadership',
      description: 'Leading teams effectively during crisis situations',
      duration: '60 minutes',
      difficulty: 'Advanced',
      category: 'Leadership',
      lessons: [
        {
          id: 'decision-making',
          title: 'Crisis Decision Making',
          content: 'During a crisis, leaders must make quick decisions with incomplete information while managing stress and uncertainty.',
          keyPoints: [
            'Gather available information quickly but don\'t wait for perfect information',
            'Consider the potential consequences of both action and inaction',
            'Communicate decisions clearly and explain the reasoning when possible',
            'Be prepared to adjust decisions as new information becomes available',
            'Delegate responsibilities to trusted team members to manage workload'
          ]
        },
        {
          id: 'communication',
          title: 'Crisis Communication',
          content: 'Effective communication during a crisis helps maintain order, reduces panic, and ensures coordinated response efforts.',
          keyPoints: [
            'Provide regular updates even when there\'s no new information',
            'Be honest about what you know and what you don\'t know',
            'Use multiple communication channels to reach all stakeholders',
            'Tailor your message to different audiences (employees, customers, media)',
            'Designate a single spokesperson to avoid conflicting messages'
          ]
        }
      ],
      quiz: [
        {
          id: 'l1',
          question: 'During a crisis, what is the most important aspect of leadership communication?',
          options: [
            'Providing detailed technical information',
            'Maintaining regular, honest communication even with limited information',
            'Waiting until you have complete information before communicating',
            'Delegating all communication to the PR team'
          ],
          correctAnswer: 1,
          explanation: 'Regular, honest communication helps maintain trust and prevents rumors. People need to know you\'re aware and actively managing the situation.'
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500 text-white';
      case 'Intermediate': return 'bg-yellow-500 text-black';
      case 'Advanced': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cyber': return <Shield className="w-5 h-5" />;
      case 'Physical': return <Target className="w-5 h-5" />;
      case 'Operational': return <Users className="w-5 h-5" />;
      case 'Leadership': return <Brain className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    const module = trainingModules.find(m => m.id === selectedModule)!;
    if (currentQuestion < module.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const module = trainingModules.find(m => m.id === selectedModule)!;
    let correctAnswers = 0;
    
    userAnswers.forEach((answer, index) => {
      if (answer === module.quiz[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(Math.round((correctAnswers / module.quiz.length) * 100));
    setQuizComplete(true);
  };

  const resetModule = () => {
    setCurrentLesson(0);
    setShowQuiz(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizComplete(false);
    setScore(0);
  };

  const selectedModuleData = trainingModules.find(m => m.id === selectedModule);

  if (quizComplete) {
    return (
      <Card className="glass-panel border-starlink-blue/50 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-starlink-blue flex items-center">
            <Award className="w-6 h-6 mr-2" />
            Training Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <div className="text-6xl font-bold text-starlink-blue mb-2">{score}%</div>
            <p className="text-starlink-grey-light">Final Score</p>
          </div>
          
          <div className="space-y-2">
            {score >= 80 ? (
              <div className="text-green-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Excellent! You've demonstrated strong understanding of the material.</p>
              </div>
            ) : score >= 70 ? (
              <div className="text-yellow-400">
                <p>Good job! Consider reviewing the material for areas you missed.</p>
              </div>
            ) : (
              <div className="text-red-400">
                <p>You may want to review the training material and retake the quiz.</p>
              </div>
            )}
          </div>

          <div className="flex space-x-4 justify-center">
            <Button 
              onClick={resetModule}
              variant="outline"
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              Retake Training
            </Button>
            <Button 
              onClick={() => setSelectedModule('')}
              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
            >
              Choose Another Module
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedModule && selectedModuleData) {
    if (showQuiz) {
      const currentQ = selectedModuleData.quiz[currentQuestion];
      const progress = ((currentQuestion + 1) / selectedModuleData.quiz.length) * 100;

      return (
        <Card className="glass-panel border-starlink-grey/30 max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-starlink-white">Knowledge Check</CardTitle>
                <CardDescription className="text-starlink-grey-light">
                  Question {currentQuestion + 1} of {selectedModuleData.quiz.length}
                </CardDescription>
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-starlink-white mb-4">{currentQ.question}</h3>
              
              <RadioGroup 
                value={userAnswers[currentQuestion]?.toString()} 
                onValueChange={(value) => handleQuizAnswer(parseInt(value))}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-starlink-grey-light">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : setShowQuiz(false)}
                className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
              >
                {currentQuestion > 0 ? 'Previous' : 'Back to Lessons'}
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestion] === undefined}
                className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
              >
                {currentQuestion === selectedModuleData.quiz.length - 1 ? 'Complete Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Lesson view
    const currentLessonData = selectedModuleData.lessons[currentLesson];
    const lessonProgress = ((currentLesson + 1) / selectedModuleData.lessons.length) * 100;

    return (
      <Card className="glass-panel border-starlink-grey/30 max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-starlink-white">{currentLessonData.title}</CardTitle>
              <CardDescription className="text-starlink-grey-light">
                Lesson {currentLesson + 1} of {selectedModuleData.lessons.length} • {selectedModuleData.title}
              </CardDescription>
            </div>
            <div className="w-32">
              <Progress value={lessonProgress} className="h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-starlink-grey-light mb-6 leading-relaxed">{currentLessonData.content}</p>
            
            <div>
              <h4 className="font-medium text-starlink-white mb-3">Key Points to Remember:</h4>
              <ul className="space-y-2">
                {currentLessonData.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-starlink-blue mt-0.5 flex-shrink-0" />
                    <span className="text-starlink-grey-light">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => currentLesson > 0 ? setCurrentLesson(currentLesson - 1) : setSelectedModule('')}
              className="border-starlink-grey/40 text-starlink-white hover:bg-starlink-slate-light"
            >
              {currentLesson > 0 ? 'Previous Lesson' : 'Back to Modules'}
            </Button>
            <Button
              onClick={() => {
                if (currentLesson < selectedModuleData.lessons.length - 1) {
                  setCurrentLesson(currentLesson + 1);
                } else {
                  setShowQuiz(true);
                }
              }}
              className="bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark"
            >
              {currentLesson === selectedModuleData.lessons.length - 1 ? 'Take Quiz' : 'Next Lesson'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Module selection view
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-starlink-blue/50">
        <CardHeader>
          <CardTitle className="text-starlink-blue flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            Threat Awareness Training
          </CardTitle>
          <CardDescription className="text-starlink-grey-light">
            Interactive modules to enhance your team's threat awareness and response capabilities
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingModules.map((module) => (
          <Card 
            key={module.id}
            className="glass-panel border-starlink-grey/30 hover:border-starlink-blue/50 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedModule(module.id);
              resetModule();
            }}
          >
            <CardHeader>
              <CardTitle className="text-starlink-white flex items-center">
                {getCategoryIcon(module.category)}
                <span className="ml-2">{module.title}</span>
              </CardTitle>
              <CardDescription className="text-starlink-grey-light">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                  <span>{module.duration}</span>
                </div>
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-starlink-grey-light">
                  {module.lessons.length} lessons • {module.quiz.length} quiz questions
                </div>
                <PlayCircle className="w-6 h-6 text-starlink-blue" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThreatAwarenessTraining;