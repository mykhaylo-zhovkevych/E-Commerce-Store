import configPromise from '@payload-config'
import { getPayload } from 'payload'

// import {Button} from "@/components/ui/button";
// import {Progress} from "@/components/ui/progress";
// import {Input} from "@/components/ui/input";
// import {Textarea} from "@/components/ui/textarea";
// import {Checkbox} from "@/components/ui/checkbox";

export default async function Home() {

    const payload = await getPayload({
        config: configPromise,
    })
    const data = await payload.find({
        collection: "users",
    })

    return (
     <div>
         {
             JSON.stringify(data, null, 2)
         }
     </div>
    // <div className="flex flex-col gap-y-4">
    //     <div>
    //         <Button variant="elevated" >
    //             Test Button
    //         </Button>
    //     </div>
    //     <div>
    //         <Input placeholder="Input test" />
    //     </div>
    //     <div>
    //         <Input placeholder="Input test" />
    //     </div>
    //     <div>
    //         <Progress value={50}></Progress>
    //     </div>
    //     <div>
    //         <Textarea placeholder="Textarea"></Textarea>
    //     </div>
    //     <div>
    //         <Checkbox></Checkbox>
    //     </div>
    // </div>
  )
}
