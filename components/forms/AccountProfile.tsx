// "use client";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { UserValidation } from "@/lib/validations/user";
// import { z } from "zod";
// import Image from "next/image";
// import { ChangeEvent, useState } from "react";
// import { cn, isBase64Image } from "@/lib/utils";
// import { useUploadThing } from "@/lib/uploadthing";
// import { updateUser } from "@/lib/actions/user.action";
// import { useRouter, usePathname } from "next/navigation";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { format } from "date-fns";

// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";

// interface Props {
//   user: {
//     id: string;
//     objectId: string;
//     username: string;
//     name: string;
//     bio: string;
//     image: string;
//     phone: string;
//     birthday: string;
//     gender: boolean; // Thay đổi kiểu dữ liệu từ string sang boolean
//   };
//   btnTitle: string;
// }

// const AccountProfile = ({ user, btnTitle }: Props) => {
//   const [files, setFiles] = useState<File[]>([]);
//   const { startUpload } = useUploadThing("imageUploader");
//   const router = useRouter();
//   const pathname = usePathname();

//   const form = useForm({
//     resolver: zodResolver(UserValidation),
//     defaultValues: {
//       profile_photo: user?.image || "",
//       name: user?.name || "",
//       username: user?.username || "",
//       bio: user?.bio || "",
//       phone: user?.phone || "",
//       birthday: user?.birthday || "",
//       gender: user?.gender ? "1" : "0", // Chuyển đổi boolean sang string cho RadioGroup
//     },
//   });

//   const {
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     formState: { errors },
//   } = form;

//   const selectedDate = watch("birthday");

//   const handleImage = (
//     e: ChangeEvent<HTMLInputElement>,
//     fieldChange: (value: string) => void
//   ) => {
//     e.preventDefault();
//     const fileReader = new FileReader();
//     if (e.target.files && e.target.files.length) {
//       const file = e.target.files[0];
//       setFiles(Array.from(e.target.files));
//       if (!file.type.includes("image")) return;
//       fileReader.onload = async (event) => {
//         const imageDataUrl = event.target?.result?.toString() || "";
//         fieldChange(imageDataUrl);
//       };
//       fileReader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (values: z.infer<typeof UserValidation>) => {
//     const blob = values.profile_photo;
//     const hasImageChanged = isBase64Image(blob);

//     if (hasImageChanged) {
//       const imgRes = await startUpload(files);
//       if (imgRes && imgRes[0].url) {
//         values.profile_photo = imgRes[0].url;
//       }
//     }

//     await updateUser({
//       name: values.name,
//       path: pathname,
//       username: values.username,
//       userId: user.id,
//       bio: values.bio,
//       image: values.profile_photo,
//       phone: values.phone,
//       birthday: values.birthday,
//       gender: values.gender === "1", // Chuyển đổi string về boolean
//     });

//     if (pathname === "/profile/edit") {
//       router.back();
//     } else {
//       router.push("/");
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         {/* Ảnh đại diện */}
//         <FormField
//           control={control}
//           name="profile_photo"
//           render={({ field }) => (
//             <FormItem className="flex items-center gap-4">
//               <FormLabel className="">
//                 {field.value ? (
//                   <Image
//                     src={field.value}
//                     alt="profile photo"
//                     width={96}
//                     height={96}
//                     priority
//                     className="rounded-full object-contain"
//                   />
//                 ) : (
//                   <Image
//                     src="/assets/images/0d80fa84f049bc902d6786a7d5574ca6.jpg"
//                     alt="profile photo"
//                     width={96}
//                     height={96}
//                     priority
//                     className="object-contain"
//                   />
//                 )}
//               </FormLabel>
//               <FormControl className="text-dark100_light500 flex-1 text-base">
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   placeholder="Upload a photo"
//                   className=""
//                   onChange={(e) => handleImage(e, field.onChange)}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         {/* Tên */}
//         <FormField
//           control={control}
//           name="name"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col gap-3">
//               <FormLabel className="text-dark100_light500 text-base">
//                 Name
//               </FormLabel>
//               <FormControl className="text-dark100_light500 flex-1 text-base">
//                 <Input type="text" className="" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         {/* Username */}
//         <FormField
//           control={control}
//           name="username"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col gap-3">
//               <FormLabel className="text-dark100_light500 text-base">
//                 Username
//               </FormLabel>
//               <FormControl className="text-dark100_light500 flex-1 text-base">
//                 <Input type="text" className="" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         {/* Số điện thoại */}
//         <FormField
//           control={control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col gap-3">
//               <FormLabel className="text-dark100_light500 text-base">
//                 Phone
//               </FormLabel>
//               <FormControl className="text-dark100_light500 flex-1 text-base">
//                 <Input type="text" className="" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         {/* Ngày sinh */}
//         <FormField
//           control={control}
//           name="birthday"
//           render={({ field }) => (
//             <FormItem className="flex flex-col gap-3">
//               <FormLabel className="text-dark100_light500 text-base">
//                 Birthday
//               </FormLabel>
//               <FormControl>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant={"outline"}
//                       className={cn(
//                         "w-[280px] justify-start text-left font-normal",
//                         !selectedDate && "text-muted-foreground"
//                       )}
//                     >
//                       <CalendarIcon className="mr-2 size-4" />
//                       {selectedDate ? (
//                         format(new Date(selectedDate), "PPP")
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={
//                         selectedDate ? new Date(selectedDate) : undefined
//                       }
//                       onSelect={(date) => {
//                         if (date) {
//                           setValue("birthday", date.toISOString());
//                         }
//                       }}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </FormControl>
//               {errors.birthday && (
//                 <p className="text-sm text-red-500">
//                   {errors.birthday.message}
//                 </p>
//               )}
//             </FormItem>
//           )}
//         />
//         {/* Giới tính */}
//         <FormField
//           control={control}
//           name="gender"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col gap-3">
//               <FormLabel className="text-dark100_light500 text-base">
//                 Gender
//               </FormLabel>
//               <FormControl className="text-dark100_light500 flex-1 text-base">
//                 <RadioGroup
//                   value={field.value}
//                   onValueChange={(value) => field.onChange(value)}
//                   className="flex space-x-4"
//                 >
//                   <RadioGroupItem value="1" id="male">
//                     Nam
//                   </RadioGroupItem>
//                   <RadioGroupItem value="0" id="female">
//                     Nữ
//                   </RadioGroupItem>
//                 </RadioGroup>
//               </FormControl>
//               {errors.gender && (
//                 <p className="text-sm text-red-500">{errors.gender.message}</p>
//               )}
//             </FormItem>
//           )}
//         />
//         {/* Tiểu sử */}
//         <FormField
//           control={control}
//           name="bio"
//           render={({ field }) => (
//             <FormItem className="flex w-full flex-col gap-3">
//               <FormLabel className="text-dark100_light500 text-base">
//                 Bio
//               </FormLabel>
//               <FormControl className="text-dark100_light500 flex-1 text-base">
//                 <Textarea rows={10} className="" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <Button type="submit" className="bg-primary-100">
//           {btnTitle}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default AccountProfile;
