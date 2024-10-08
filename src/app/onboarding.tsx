'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Steps } from "@/components/ui/steps"
import { Camera, Upload } from 'lucide-react'
import LogoSvg from '@/assets/logo_blox.svg'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"


interface FormData {
  nome: string;
  cpf: string;
  documentoFoto: string | null;
  selfie: string | null;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    documentoFoto: null,
    selfie: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const steps = [
    { title: 'Dados Pessoais', description: 'Nome e CPF' },
    { title: 'Documento', description: 'Foto do documento' },
    { title: 'Selfie', description: 'Foto pela câmera' },
    { title: 'Revisão', description: 'Confirme seus dados' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fotobase64 = await toBase64(e.target.files[0]);
      console.log(fotobase64)
      setFormData({ ...formData, documentoFoto: fotobase64 as string })
    }
  }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera: ", err)
      }
    }

  const takePicture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height) 
        const imageDataUrl = canvas.toDataURL('image/jpeg')
        setFormData({ ...formData, selfie: imageDataUrl })

        // Stop the video stream
        const stream = video.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Digite seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="Digite seu CPF" />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="documento">Foto do Documento</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="documento" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para fazer upload</span> ou arraste e solte</p>
                  <p className="text-xs text-gray-500">PNG, JPG ou PDF (MAX. 5MB)</p>
                </div>
                <Input id="documento" name="documento" type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            {formData.documentoFoto && <p className="text-sm text-green-600">Arquivo selecionado: {formData.documentoFoto.slice(0, 20)}...</p>}
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <Label>Tire uma Selfie</Label>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-md aspect-video">
                <video ref={videoRef} className="w-full h-full" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" width="640" height="480" />
              </div>
              {!formData.selfie ? (
                <>
                  <Button type="button" onClick={startCamera} className="w-full max-w-md">
                    <Camera className="w-4 h-4 mr-2" /> Iniciar Câmera
                  </Button>
                  <Button onClick={takePicture} className="w-full max-w-md">
                    Tirar Foto
                  </Button>
                </>
              ) : (
                <div className="w-full max-w-md">
                  <img src={formData.selfie} alt="Selfie" className="w-full rounded-lg" />
                  <Button onClick={() => setFormData({ ...formData, selfie: null })} className="w-full mt-4">
                    Tirar Nova Foto
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Revise seus dados</h3>
            <p><strong>Nome:</strong> {formData.nome}</p>
            <p><strong>CPF:</strong> {formData.cpf}</p>
            <p><strong>Documento:</strong> {formData.documentoFoto ? formData.documentoFoto : 'Não enviado'}</p>
            {formData.selfie && (
              <div>
                <p><strong>Selfie:</strong></p>
                <img src={formData.selfie} alt="Selfie" className="w-32 h-32 rounded-lg" />
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
  
    const formDataToSend = new FormData()
    formDataToSend.append('nome', formData.nome)
    formDataToSend.append('cpf', formData.cpf)
    if (formData.documentoFoto) {
      formDataToSend.append('documentoFoto', formData.documentoFoto.slice(0, 20))
    }
    if (formData.selfie) {
      formDataToSend.append('selfie', formData.selfie.slice(0, 20))
    }
  
    try {

    
      
      
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        body: formDataToSend,
      })
  
      if (response.ok) {
        const data = await response.json()
        setSubmitStatus('success')
        console.log('Dados enviados com sucesso:', data)
      } else {
        
        setSubmitStatus('error')
        console.error('Falha ao enviar dados:')
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Erro ao enviar dados:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-8">
        <LogoSvg width={150} height={150}/>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Onboarding Bancário</CardTitle>
          <CardDescription>Complete seu cadastro para abrir sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <Steps steps={steps} currentStep={step} />
          <form onSubmit={handleSubmit} className="mt-8">
            {renderStep()}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 0 && (
            <Button type="button" onClick={prevStep}>
              Voltar
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSubmit} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          )}
        </CardFooter>
      </Card>
      {submitStatus === 'success' && (
        <Alert className="mt-4">
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            Seu formulário foi enviado com sucesso. Entraremos em contato em breve.
          </AlertDescription>
        </Alert>
      )}
      {submitStatus === 'error' && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}