import  os
import time
from PIL import Image

#compose date
y=time.strftime("%Y")
m=time.strftime("%m")
d=time.strftime("%d")

if m[0] == '0' :
    m=m.replace('0','')

if d[0] == '0':
    d=d.replace('0','')


path = "./images/image"+y+m+d
files = []

def getImages(path):
    global files
    files = os.listdir(path)
    images = []
    for file in files:
        if not os.path.isdir(file) and 'png' in file:
            print(path + "/" + file)
            image = Image.open(path + "/" + file)
            images.append(image)
    return images

def getCode(img, size):
    result = []
    # print("x==",size[0])
    # print("y==",size[1]-1)

    x_size = size[0] - 1  # width
    y_size = size[1]  # high
    for x in range(0, x_size):
        for y in range(0, y_size):
            now_value = img.getpixel((x, y))
            next_value = img.getpixel((x + 1, y))

            if next_value < now_value:
                result.append(1)
            else:
                result.append(0)

    return result

def compCode(code1, code2):
    num = 0
    for index in range(0, len(code1)):
        if code1[index] != code2[index]:
            num += 1
    return num

if __name__ == '__main__':
    __all__=['Image']
    size = (9, 8)
    images = getImages(path)
    imageCodes=[]
    for image in images:
        modify_image =  image.resize(size).convert('L')
        code = getCode(modify_image,size)
        imageCodes.append(code)

    j=0
    delindex = []
    while j < len(imageCodes):
        for index in range(j+1,len(imageCodes)):
            destance = compCode(imageCodes[j],imageCodes[index])
            if destance < 5:
                if j not in delindex:
                    delindex.append(j)
        j+=1

    print(delindex)
    for item in delindex:
        if os.path.exists(path+"/"+files[item]):
            os.remove(path+"/"+files[item])