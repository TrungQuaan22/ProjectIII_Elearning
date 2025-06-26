// import React, { useState } from 'react'
// import { Box, Flex, Stack, Input, Text, Fieldset } from '@chakra-ui/react'
// import { Button } from 'src/components/ui/button'
// import { Field } from 'src/components/ui/field'
// import { useForm } from 'react-hook-form'
// import { useDispatch } from 'react-redux'
// import { changePassword } from 'src/redux/authSlice'
// import { toast } from 'react-toastify'

// interface ChangePasswordForm {
//   old_password: string
//   password: string
//   confirm_password: string
// }

// export default function ChangePassword({ onCancel }: { onCancel: () => void }) {
//   const dispatch = useDispatch() // Dùng dispatch từ Redux
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError
//   } = useForm<ChangePasswordForm>({
//     defaultValues: {
//       old_password: '',
//       password: '',
//       confirm_password: ''
//     }
//   })

//   const onSubmit = async (data: ChangePasswordForm) => {
//     try {
//       const resultAction = await dispatch(changePassword(data))
//       if (changePassword.fulfilled.match(resultAction)) {
//         toast.success('Password changed successfully!')
//         onCancel()
//       }
//     } catch (error: any) {
//       // Xử lý lỗi nếu có
//       toast.error('Failed to change password.')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Fieldset.Root size='lg'>
//         <Stack>
//           <Fieldset.Legend fontSize='20px' fontWeight={500} color='rgba(255, 69, 0, 0.78)'>
//             Change Password
//           </Fieldset.Legend>
//         </Stack>

//         <Fieldset.Content mt={10}>
//           <Field label='Current Password'>
//             <Input
//               {...register('old_password', {
//                 required: 'Current password is required'
//               })}
//               type='password'
//             />
//             <Box minHeight='1.2rem'>
//               {errors.old_password && (
//                 <Text color='red.500' fontSize='sm'>
//                   {errors.old_password.message}
//                 </Text>
//               )}
//             </Box>
//           </Field>
//           <Field label='New Password'>
//             <Input
//               {...register('password', {
//                 required: 'New password is required',
//                 minLength: { value: 6, message: 'Password must be at least 6 characters long' }
//               })}
//               type='password'
//             />
//             <Box minHeight='1.2rem'>
//               {errors.password && (
//                 <Text color='red.500' fontSize='sm'>
//                   {errors.password.message}
//                 </Text>
//               )}
//             </Box>
//           </Field>
//           <Field label='Confirm New Password'>
//             <Input
//               {...register('confirm_password', {
//                 required: 'Please confirm your new password',
//                 validate: (value, { password }) => value === password || 'Passwords do not match'
//               })}
//               type='password'
//             />
//             <Box minHeight='1.2rem'>
//               {errors.confirm_password && (
//                 <Text color='red.500' fontSize='sm'>
//                   {errors.confirm_password.message || ''}
//                 </Text>
//               )}
//             </Box>
//           </Field>
//         </Fieldset.Content>

//         <Flex justifyContent='flex-end' gap={10} mt={10}>
//           <Button type='reset' onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type='submit' loading={isSubmitting}>
//             Submit
//           </Button>
//         </Flex>
//       </Fieldset.Root>
//     </form>
//   )
// }
