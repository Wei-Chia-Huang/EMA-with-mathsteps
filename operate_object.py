from addition_classify import addition_classify
from subtraction_classify import subtraction_classify
from multiplication_classify import multiplication_classify
from division_classify import division_classify
# from decimal_operation_classify import decimal_operation_classify

import unicodedata

class Node():
    def __init__(self, step):
        self.operator = step[0]
        self.values = step[1]
        self.solutions = self.classify()
        # self.__preprocessing(question)  # 將輸入預處理
    
    # 根據物件的 self.operator 來決定分類方式，並回傳分類結果
    def classify(self):
        if self.operator == "ans":
            return None
        elif self.operator == "add":
            return addition_classify(str(self.values[0]), str(self.values[1]))
        elif self.operator == "sub":
            return subtraction_classify(str(self.values[0]), str(self.values[1]))
        elif self.operator == "mul":
            return multiplication_classify(str(self.values[0]), str(self.values[1]))
        elif self.operator == "div":
            return division_classify(str(self.values[0]), str(self.values[1]))

    # 將輸入預處理，建立此物件的屬性
    def __preprocessing(self, question):
        # 運算子符號
        operator_list = ["+", "-", "*", "/"]  
        
        # 停用符號
        ignore_symbols = [" ", "=", "?", "#", "@", "\""]  

        # 將題目字元轉為半形大小
        question = unicodedata.normalize("NFKC", question)  

        for char in ignore_symbols:
            if char in question:
                question = question.replace(char, "")
        
        for char in operator_list:
            if char in question:
                self.operator = char
        
        self.LeftValue = question.split(self.operator)[0]
        self.RightValue = question.split(self.operator)[1]


# class Addition(Node):
#     def __init__(self, operator, left_value, right_value):
#         super().__init__()
#         self.operator = operator
#         self.LeftValue = left_value
#         self.RightValue = right_value
    
#     def result(self): 
#         return addition_classify(self.LeftValue, self.RightValue)

# class Subtraction(Node):
#     def __init__(self, operator, left_value, right_value):
#         super().__init__()
#         self.operator = operator
#         self.LeftValue = left_value
#         self.RightValue = right_value
    
#     def result(self):
#         print("substraction") 

# class Mutiplication(Node):
#     def __init__(self, operator, left_value, right_value):
#         super().__init__()
#         self.operator = operator
#         self.LeftValue = left_value
#         self.RightValue = right_value
    
#     def result(self):
#         print("mutiplication") 

# class Division(Node):
    # def __init__(self, operator, left_value, right_value):
    #     super().__init__()
    #     self.operator = operator
    #     self.LeftValue = left_value
    #     self.RightValue = right_value
    
    # def result(self):
    #     print("division") 