' VBA script that converts the color of a cell to a keyword

Sub CheckerBoard()

  ' Loop through each row of the board
  For i = 1 To 51

    ' Loop through each column of the board
    For j = 1 To 8

         If (Cells(i, j).Interior.ColorIndex = 43) Then
            Cells(i, j) = "recent"
            
        ElseIf (Cells(i, j).Interior.ColorIndex = 33) Then
            Cells(i, j) = "passed"
            
        ElseIf (Cells(i, j).Interior.ColorIndex = 6) Then
            Cells(i, j) = "pending"
        
        Else
            Cells(i, j) = ""
        
        End If
        


    Next j

  Next i

End Sub


