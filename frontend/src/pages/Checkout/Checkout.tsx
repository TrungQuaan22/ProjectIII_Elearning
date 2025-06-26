import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  Input,
  Button,
  Text,
  Fieldset,
  Flex,
  createListCollection,
  VStack,
  HStack,
  Divider
} from '@chakra-ui/react'
import { Field } from 'src/components/ui/field'
import styles from '../Cart/Cart.module.scss'
import { NativeSelectField, NativeSelectRoot } from 'src/components/ui/native-select'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from 'src/components/ui/breadcrumb'
import { useParams, useNavigate } from 'react-router-dom'
import http from 'src/utils/http'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

function formatDateTimeLocal(dateTime: string): string {
  const date = new Date(dateTime)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

interface Profile {
  id: number
  employee_code: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  province: {
    id: number
    name: string
  }
  district: {
    id: number
    name: string
  }
  ward: {
    id: number
    name: string
  }
}

// Định nghĩa kiểu dữ liệu cho CartItems
interface CartItem {
  id: number
  quantity: number
  borrow_date: string
  return_date: string
  book: {
    id: number
    name: string
    images: string[]
  }
}

type FormValues = {
  phone: string
  address: string
  province_id: string | number
  district_id: string | number
  ward_id: string | number
  cart_id: string | number
}

export default function Checkout(): React.ReactElement {
  const navigate = useNavigate()
  const { cartId } = useParams<{ cartId: string }>()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [formData, setFormData] = useState<FormValues>({
    phone: '',
    address: '',
    province_id: '',
    district_id: '',
    ward_id: '',
    cart_id: cartId ? Number(cartId) : ''
  })
  const [loading, setLoading] = useState(false)

  //Fetch data checkout
  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const response = await http.get(`orders/require-borrow/cart/${cartId}`)
        setCartItems(response.data.data.cart.items)
        setProfile(response.data.data.cart.user)
        setFormData((prevFormData) => ({
          ...prevFormData,
          phone: response.data.data.cart.user.phone,
          address: response.data.data.cart.user.address,
          province_id: response.data.data.cart.user.province?.id || '',
          district_id: response.data.data.cart.user.district?.id || '',
          ward_id: response.data.data.cart.user.ward?.id || ''
        }))
      } catch (error) {
        console.error(error)
        // navigate('/')
      }
    }
    fetchCheckout()
  }, [])
  //fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await http.get('provinces')
        setProvinces(response.data.data.provinces)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProvinces()
  }, [])
  //fetch districts
  useEffect(() => {
    if (formData.province_id) {
      const fetchDistricts = async () => {
        try {
          const response = await http.get(`provinces/${formData.province_id}`)
          setDistricts(response.data.data.province.districts)
        } catch (error) {
          console.error(error)
        }
      }
      fetchDistricts()
    }
  }, [formData.province_id])
  //fetch wards
  useEffect(() => {
    if (formData.district_id) {
      const selectedDistrict = districts.find((d) => d.id === formData.district_id)
      if (selectedDistrict) {
        setWards(selectedDistrict.wards)
      }
    }
  }, [formData.district_id, districts])
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      phone: '',
      address: '',
      province_id: '',
      district_id: '',
      ward_id: '',
      cart_id: cartId ? Number(cartId) : ''
    }
  })

  const onSubmit = async () => {
    try {
      const response = await http.post('orders/confirm-borrow', {
        ...formData
      })
      if (response.data.status === 'success') {
        toast.success(response.data.message)
        navigate('/my-orders')
      }
    } catch (error: any) {
      if (error.response?.data?.error.code === 422) {
        toast.error('Please fill in all required fields', {
          autoClose: 3000
        })
      }
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setValue(name as keyof FormValues, value)
  }

  return (
    <Flex justifyContent='center'>
      <Box minWidth='1260px' padding='50px 0px'>
        {/* Breadcrumb */}
        <Box width='full' maxWidth='container.md' mb={8}>
          <BreadcrumbRoot>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            <BreadcrumbLink href='/cart'>Cart</BreadcrumbLink>
            <BreadcrumbCurrentLink>Checkout</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
        </Box>
        <Flex justifyContent='space-between'>
          <Box direction='column' gap={20} as='form' onSubmit={handleSubmit(onSubmit)} id='checkout-form' width='40%'>
            <Fieldset.Root size='lg'>
              <Fieldset.Legend>Customer Infomation</Fieldset.Legend>
              <Flex direction='column' gap='20px' margin='20px 0'>
                {/* Full Name */}
                <Field label='Full Name'>
                  <Input placeholder='Full Name' value={profile?.full_name} disabled />
                </Field>
                {/* Email Address */}
                <Field label='Email Address'>
                  <Input placeholder='Email Address' type='email' value={profile?.email} disabled />
                </Field>
                {/* Phone Number */}
                <Field label='Phone Number'>
                  <Input
                    placeholder='Phone Number'
                    type='tel'
                    required
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && <p>{errors.phone.message}</p>}
                </Field>

                <Field label='Province'>
                  <NativeSelectRoot>
                    <NativeSelectField
                      name='province_id'
                      items={['Select Province', ...provinces.map((p) => p.name)]}
                      value={
                        formData.province_id
                          ? provinces.find((p) => p.id === formData.province_id)?.name || ''
                          : 'Select Province'
                      }
                      onChange={(e) => {
                        const id = provinces.find((p) => p.name === e.target.value)?.id || null
                        setFormData((prev) => ({ ...prev, province_id: id }))
                      }}
                    />
                  </NativeSelectRoot>
                </Field>
                <Field label='District'>
                  <NativeSelectRoot>
                    <NativeSelectField
                      name='district_id'
                      items={['Select District', ...districts.map((d) => d.name)]}
                      value={
                        formData.district_id
                          ? districts.find((d) => d.id === formData.district_id)?.name || ''
                          : 'Select District'
                      }
                      onChange={(e) => {
                        const id = districts.find((d) => d.name === e.target.value)?.id || ''
                        setFormData((prev) => ({ ...prev, district_id: id }))
                      }}
                    />
                  </NativeSelectRoot>
                </Field>
                <Field label='Ward'>
                  <NativeSelectRoot>
                    <NativeSelectField
                      name='ward_id'
                      items={['Select Ward', ...wards.map((w) => w.name)]}
                      value={
                        formData.ward_id ? wards.find((w) => w.id === formData.ward_id)?.name || '' : 'Select Ward'
                      }
                      onChange={(e) => {
                        const id = wards.find((w) => w.name === e.target.value)?.id || ''
                        setFormData((prev) => ({ ...prev, ward_id: id }))
                      }}
                    />
                  </NativeSelectRoot>
                </Field>
              </Flex>

              {/* Address */}
              <Field label='Address (Optional)'>
                <Input name='address' placeholder='Address' value={formData.address} onChange={handleInputChange} />
                {errors.address && <p>{errors.address.message}</p>}
              </Field>
            </Fieldset.Root>
          </Box>
          <Box flex={1}>
            <div className={styles['cart-container']}>
              {/* Header */}
              <div className={styles['cart-header']}>
                <p style={{ width: '200px' }}>Product</p>
                <p>Quantity</p>
                <p>Borrowed Date</p>
                <p>Return Date</p>
              </div>

              {/* Rows */}
              {cartItems.map((item) => (
                <div className={styles['cart-row']} key={item.id}>
                  {/* Product */}
                  <div className={styles['product-info']}>
                    <div className={styles['product-img']}>
                      <img src={item.book.images[0]} alt={item.book.name} />
                    </div>
                    <p>{item.book.name}</p>
                  </div>
                  {/* Quantity */}
                  <Text>{item.quantity}</Text>
                  {/* Return Date */}
                  <div className={styles['return-date']}>
                    <Text>{formatDateTimeLocal(item.borrow_date)}</Text>
                  </div>
                  <div className={styles['return-date']}>
                    <Text>{formatDateTimeLocal(item.return_date)}</Text>
                  </div>
                </div>
              ))}
              <div className={styles.btnProcess}>
                <Button type='submit' form='checkout-form' className={styles.buttonCheckout}>
                  Confirm Borrow Books
                </Button>
              </div>
            </div>
          </Box>
        </Flex>
        {/* Info*/}
      </Box>
    </Flex>
  )
}
