// import React, { useEffect, useState } from 'react'
// import { Flex, Stack, Image, Button, Fieldset, Input } from '@chakra-ui/react'
// // import { Field } from 'src/components/ui/field'
// // import { NativeSelectField, NativeSelectRoot } from 'src/components/ui/native-select'
// import http from 'src/utils/http'
// import { toast } from 'react-toastify'

// interface UserInfo {
//   id: number
//   full_name: string
//   email: string
//   phone: string | null
//   gender: number
//   dob: string | null
//   employee_code: string
//   avatar: string | null
//   status: number
//   google_id: string | null
//   province_id: number | null
//   district_id: number | null
//   ward_id: number | null
//   address: string | null
//   role: number
//   created_at: string
//   updated_at: string
// }

// export default function ChangeProfile({onCancel}: {onCancel: () => void}) {
//   const [userInfo, setUserInfo] = useState<UserInfo>({
//     id: 0,
//     full_name: '',
//     email: '',
//     phone: '',
//     gender: 0,
//     dob: '',
//     employee_code: '',
//     avatar: null,
//     status: 0,
//     google_id: null,
//     province_id: null,
//     district_id: null,
//     ward_id: null,
//     address: '',
//     role: 0,
//     created_at: '',
//     updated_at: ''
//   })
//   const [provinces, setProvinces] = useState<any[]>([])
//   const [districts, setDistricts] = useState<any[]>([])
//   const [wards, setWards] = useState<any[]>([])
//   const [avatar, setAvatar] = useState<File | null>(null)

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setUserInfo((prev) => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const formData = new FormData()
//     formData.append('full_name', userInfo.full_name)
//     formData.append('phone', userInfo.phone || '')
//     formData.append('address', userInfo.address || '')
//     formData.append('province_id', userInfo.province_id?.toString() || '')
//     formData.append('district_id', userInfo.district_id?.toString() || '')
//     formData.append('ward_id', userInfo.ward_id?.toString() || '')

//     if (avatar) {
//       formData.append('avatar', avatar)
//     }
//     for (const [key, value] of formData.entries()) {
//       console.log(`${key}:`, value)
//     }

//     try {
//       const response = await http.patch('users/update-profile', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       console.log(response.data)

//       if(response.data.status === 'success') {
//         toast.success(response.data.message)
//       }
//     } catch (error) {
//       toast.error('Failed to update profile!')
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     const fetchMyProfile = async () => {
//       try {
//         const response = await http.get('users/my-profile')
//         setUserInfo(response.data.data.user)
//       } catch (error) {
//         console.error(error)
//       }
//     }
//     fetchMyProfile()
//   }, [])

//   useEffect(() => {
//     const fetchProvinces = async () => {
//       try {
//         const response = await http.get('provinces')
//         setProvinces(response.data.data.provinces)
//       } catch (error) {
//         console.error(error)
//       }
//     }
//     fetchProvinces()
//   }, [])

//   useEffect(() => {
//     if (userInfo.province_id) {
//       const fetchDistricts = async () => {
//         try {
//           const response = await http.get(`provinces/${userInfo.province_id}`)
//           setDistricts(response.data.data.province.districts)
//         } catch (error) {
//           console.error(error)
//         }
//       }
//       fetchDistricts()
//     }
//   }, [userInfo.province_id])

//   useEffect(() => {
//     if (userInfo.district_id) {
//       const selectedDistrict = districts.find((d) => d.id === userInfo.district_id)
//       if (selectedDistrict) {
//         setWards(selectedDistrict.wards)
//       }
//     }
//   }, [userInfo.district_id, districts])
//   return (
//     <Fieldset.Root size='lg'>
//       <Stack>
//         <Fieldset.Legend fontSize='20px' fontWeight={500} color='rgba(255, 69, 0, 0.78)'>
//           Edit Your Profile
//         </Fieldset.Legend>
//       </Stack>

//       <Fieldset.Content mt={10}>
//         <Flex gap={10}>
//           <Field label='Full Name'>
//             <Input name='full_name' defaultValue={userInfo.full_name} onChange={handleInputChange} />
//           </Field>
//           <Field label='ID Number'>
//             <Input name='employee_code' value={userInfo.employee_code} disabled />
//           </Field>
//         </Flex>
//         <Flex gap={10}>
//           <Field label='Email address'>
//             <Input name='email' type='email' value={userInfo.email} disabled />
//           </Field>
//           <Field label='Phone Number'>
//             <Input name='phone' type='tel' value={userInfo.phone || ''} onChange={handleInputChange} />
//           </Field>
//         </Flex>

//         <Flex gap={10}>
//           <Field label='Province'>
//             <NativeSelectRoot>
//               <NativeSelectField
//                 name='province_id'
//                 items={['Select Province', ...provinces.map((p) => p.name)]}
//                 value={
//                   userInfo.province_id
//                     ? provinces.find((p) => p.id === userInfo.province_id)?.name || ''
//                     : 'Select Province'
//                 }
//                 onChange={(e) => {
//                   const id = provinces.find((p) => p.name === e.target.value)?.id || null
//                   setUserInfo((prev) => ({ ...prev, province_id: id }))
//                 }}
//               />
//             </NativeSelectRoot>
//           </Field>
//           <Field label='District'>
//             <NativeSelectRoot>
//               <NativeSelectField
//                 name='district_id'
//                 items={districts.map((d) => d.name)}
//                 value={districts.find((d) => d.id === userInfo.district_id)?.name || ''}
//                 onChange={(e) => {
//                   const id = districts.find((d) => d.name === e.target.value)?.id || ''
//                   setUserInfo((prev) => ({ ...prev, district_id: id }))
//                 }}
//               />
//             </NativeSelectRoot>
//           </Field>
//           <Field label='Ward'>
//             <NativeSelectRoot>
//               <NativeSelectField
//                 name='ward_id'
//                 items={wards.map((w) => w.name)}
//                 value={wards.find((w) => w.id === userInfo.ward_id)?.name || ''}
//                 onChange={(e) => {
//                   const id = wards.find((w) => w.name === e.target.value)?.id || ''
//                   setUserInfo((prev) => ({ ...prev, ward_id: id }))
//                 }}
//               />
//             </NativeSelectRoot>
//           </Field>
//         </Flex>
//         <Flex gap={10}>
//           <Field label='Address'>
//             <Input name='address' value={userInfo.address || ''} onChange={handleInputChange} />
//           </Field>
//         </Flex>
//         <Flex gap={10}>
//           <Field label='Avatar'>
//             <Image src={userInfo.avatar || ''} alt='avatar' width='100px' height='100px' border={'1px solid #ccc'} />
//             <Input
//               name='avatar'
//               type='file'
//               accept='image/*'
//               onChange={(e) => {
//                 const file = e.target.files?.[0] || null
//                 setAvatar(file)
//               }}
//             />
//           </Field>
//         </Flex>
//       </Fieldset.Content>

//       <Flex justifyContent='flex-end' gap={10} mt={10}>
//               <Button type='reset' onClick={onCancel}>Cancel</Button>
//               <Button onClick={handleSubmit}>Submit</Button>
//             </Flex>
//     </Fieldset.Root>
//   )
// }
