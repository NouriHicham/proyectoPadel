import { User, Mail, MapPin, Calendar, Phone, LinkIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function Perfil() {
  // This would typically come from your authentication system
  const user = JSON.parse(localStorage.getItem('user')).persona[0];
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
    joinDate: "January 2023",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    website: "alexjohnson.dev",
    bio: "Product designer and developer with a passion for creating intuitive user experiences. I enjoy working on projects that make a positive impact on people's lives.",
  }

  console.log(user);

  return (
   <div className="min-h-screen flex flex-col">
         <Header />
    <div className="container max-w-5xl py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Profile sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{user.nombre}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.nombre} {user.apellido}</h2>
              <p className="text-sm text-muted-foreground mb-4">{userData.bio}</p>
              <Button className="w-full">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your account information and settings</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {userData.joinDate}</span>
              </div>
              <Button variant="outline" className="w-full">
                Account Settings
              </Button>
              <Button variant="outline" className="w-full">
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main profile content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.nombre} {user.apellido}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Location</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.location}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+34 {user.telefono}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Your recent activity and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>No recent activity to display</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
    </div>
  )
}

