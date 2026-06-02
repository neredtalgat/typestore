
import { useAppSelector } from '../store/hooks'
import { Navigate } from 'react-router-dom'

interface Props {
  children: JSX.Element
}

// Если пользователь не залогинен — редиректит на /login
// Если залогинен — показывает дочерний компонент
const PrivateRoute = ({children}: Props) => {
  const user = useAppSelector((state) => state.auth.user)

  if(!user){
    return <Navigate to = "/login"/>
  }

  return children
}

export default PrivateRoute
