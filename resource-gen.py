import sys
import os
class ResourceGenerator():

  def __init__(self,name):
    self.lowerName = name.lower()
    self.name = name
    self.capitalizedName = name.capitalize()

  def createController(self):
    controllerContent = f"""
import {{ Controller, Get, Post, Body, Patch, Param, Delete }} from '@nestjs/common';
import {{{self.capitalizedName}Service}} from './{self.lowerName}.service';
import {{ Create{self.capitalizedName}Dto }} from './dto/create-{self.lowerName}.dto';
import {{ Update{self.capitalizedName}Dto }} from './dto/update-{self.lowerName}.dto';

@Controller('{self.lowerName}')
export class {self.capitalizedName}Controller {{
  constructor(private readonly {self.lowerName}Service: {self.capitalizedName}Service) {{}}

  @Post()
  create(@Body() create{self.capitalizedName}Dto: Create{self.capitalizedName}Dto) {{
    return this.{self.lowerName}Service.create(create{self.capitalizedName}Dto);
  }}

  @Get()
  findAll() {{
    return this.{self.lowerName}Service.findAll();
  }}

  @Get(':id')
  findOne(@Param('id') id: string) {{
    return this.{self.lowerName}Service.findOne(id);
  }}

  @Patch(':id')
  update(@Param('id') id: string, @Body() update{self.capitalizedName}Dto: Update{self.capitalizedName}Dto) {{
    return this.{self.lowerName}Service.update(id, update{self.capitalizedName}Dto);
  }}

  @Delete(':id')
  remove(@Param('id') id: string) {{
    return this.{self.lowerName}Service.remove(id);
  }}
}}   
    """
    return controllerContent

  def createCreateDto(self):
    content = f"""
export class Create{self.capitalizedName}Dto {{}}
    """
    return content

  def createUpdateDto(self):
    content = f"""
import {{ PartialType }} from '@nestjs/mapped-types';
import {{ Create{self.capitalizedName}Dto }} from './create-{self.lowerName}.dto';

export class Update{self.capitalizedName}Dto extends PartialType(Create{self.capitalizedName}Dto) {{}}

    """
    return content
  def createService(self):
    content = f"""
    import {{ Injectable }} from "@nestjs/common";
import {{ Create{self.capitalizedName}Dto }} from "./dto/create-{self.lowerName}.dto";
import {{ Update{self.capitalizedName}Dto }} from "./dto/update-{self.lowerName}.dto";
import {{ InjectModel }} from "@nestjs/mongoose";
import {{{self.capitalizedName}}} from "./schema/{self.lowerName}.schema";
import {{ Model }} from "mongoose";

@Injectable()
export class {self.capitalizedName}Service {{

  constructor(@InjectModel({self.capitalizedName}.name) private readonly {self.lowerName}Model: Model<{self.capitalizedName}>) {{ }}

  create(create{self.capitalizedName}Dto: Create{self.capitalizedName}Dto) {{
    return this.{self.lowerName}Model.create(create{self.capitalizedName}Dto);
  }}

  findAll() {{
    return this.{self.lowerName}Model.find({{}});
  }}

  findOne(id: string) {{
    return this.{self.lowerName}Model.findById(id);
  }}

  update(id: string, update{self.capitalizedName}Dto: Update{self.capitalizedName}Dto) {{
    return this.{self.lowerName}Model.findByIdAndUpdate(id, update{self.capitalizedName}Dto);
  }}

  remove(id: string) {{
    return this.{self.lowerName}Model.findByIdAndDelete(id);
  }}
}} 
    """
    return content
  def createModule(self):
    content = f"""
import {{ Module }} from "@nestjs/common";
import {{ MongooseModule }} from "@nestjs/mongoose";
import {{ {self.capitalizedName}Controller }} from "./{self.lowerName}.controller";
import {{ {self.capitalizedName}Service }} from "./{self.lowerName}.service";
import {{ {self.capitalizedName}, {self.capitalizedName}Schema }} from "./schema/{self.lowerName}.schema";

@Module({{
  controllers: [{self.capitalizedName}Controller],
  imports: [
    MongooseModule.forFeature([{{ name: {self.capitalizedName}.name, schema: {self.capitalizedName}Schema }}])
  ],
  providers: [{self.capitalizedName}Service],
}})
export class {self.capitalizedName}Module {{ }}
    
    """
    return content
  def createSchema(self):
    content = f"""
import {{ Schema, SchemaFactory }} from '@nestjs/mongoose';
import {{ HydratedDocument }} from 'mongoose';

export type {self.capitalizedName}Document = HydratedDocument<{self.capitalizedName}>;


@Schema()
export class {self.capitalizedName} {{
  
}}

export const {self.capitalizedName}Schema = SchemaFactory.createForClass({self.capitalizedName});

    
    """
    return content 
  

  def updateTestModuleContent(self,content):
    
    sp = content.split('imports: [')
    testModuleAddedContent = sp[0] + f'imports: [ \n      {self.capitalizedName}Module,' + 'imports: ['.join(sp[1:])
    sp2 = testModuleAddedContent.split('@Module')
    updatedModuleContent = sp2[0].strip() + f"\nimport {{{self.capitalizedName}Module}} from './{self.name}/{self.name}.module'\n\n @Module" + ''.join(sp2[1])
    return updatedModuleContent 
  


class FileWriter():
  def __init__(self,name,generator:ResourceGenerator):
    self.name = name
    self.generator = generator
  
  def create(self):
    os.chdir('src')
    os.mkdir(self.name)
    os.chdir(self.name)
    os.mkdir('dto')
    os.mkdir('schema')
    self.createSchema()
    self.createCreateDto()
    self.createUpdateDto()
    self.createService()
    self.createModule()
    self.createController()
    os.chdir('..')
    self.updateAppModule()

  def createService(self):
    with open(f'{self.name}.service.ts','w') as f:
      f.write(self.generator.createService())
  def createModule(self):
    with open(f'{self.name}.module.ts','w') as f:
      f.write(self.generator.createModule())
  def createController(self):
    with open(f'{self.name}.controller.ts','w') as f:
      f.write(self.generator.createController())
  def createSchema(self):
    with open(f'schema/{self.name}.schema.ts','w') as f:
      f.write(self.generator.createSchema())
  def createCreateDto(self):
    with open(f'dto/create-{self.name}.dto.ts','w') as f:
      f.write(self.generator.createCreateDto())
  def createUpdateDto(self):
    with open(f'dto/update-{self.name}.dto.ts','w') as f:
      f.write(self.generator.createUpdateDto())
  
  def updateAppModule(self):
    content = ''
    with open('app.module.ts','r') as f:
      content = f.read()
    with open('app.module.ts','w') as f:
      f.write(self.generator.updateTestModuleContent(content))

if __name__ == '__main__':
  name = sys.argv[1]
  generator = ResourceGenerator(name)
  writer = FileWriter(name,generator)

  writer.create()