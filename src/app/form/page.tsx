
import LoginForm from '@/components/form-example/LoginForm'
// import RegisterForm from '@/components/form-example/Register'
import  {  FileUploadFillProgressDemo } from '@/components/form-example/UploadFile'

export default function page() {
  return (
    <div>

   <FileUploadFillProgressDemo/>
   <LoginForm/>
   {/* <RegisterForm/> */}
    </div>
  )
}
